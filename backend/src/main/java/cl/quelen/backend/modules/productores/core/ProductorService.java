package cl.quelen.backend.modules.productores.core;

import cl.quelen.backend.modules.productores.exportador.persistence.ProductorExportadorRepository;
import cl.quelen.backend.modules.productores.exportador.persistence.ExportadorRepository;
import cl.quelen.backend.modules.productores.persistence.ProductorRepository;
import cl.quelen.backend.modules.productores.persistence.ProductorRepository.GuardarRequest;
import cl.quelen.backend.modules.productores.web.dto.CrearProductorRequest;
import cl.quelen.backend.modules.productores.web.dto.ProductorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductorService {

    private static final Logger log = LoggerFactory.getLogger(ProductorService.class);

    private final ProductorRepository repo;
    private final ComunaCsvDictionary comunas;
    private final ProductorExportadorRepository vxRepo;   // vínculos
    private final ExportadorRepository exportRepo;        // existencia de exportadores

    public ProductorService(ProductorRepository repo,
                            ComunaCsvDictionary comunas,
                            ProductorExportadorRepository vxRepo,
                            ExportadorRepository exportRepo) {
        this.repo = repo;
        this.comunas = comunas;
        this.vxRepo = vxRepo;
        this.exportRepo = exportRepo;
    }

    public ProductorResponse crear(CrearProductorRequest req) {
        // 1) Validaciones de campos requeridos
        if (isBlank(req.codEmp))  return fail(null, "codEmp es requerido");
        if (isBlank(req.codTem))  return fail(null, "codTem es requerido");
        if (isBlank(req.codPro))  return fail(null, "codPro es requerido");
        if (isBlank(req.nomPro))  return fail(req.codPro, "nomPro es requerido");
        if (isBlank(req.zon))     return fail(req.codPro, "zon es requerido");
        if (isBlank(req.comunaCodigo)) return fail(req.codPro, "comunaCodigo es requerido");

        // 2) Duplicado de (EMP,TEM,PRO)
        if (repo.existsByEmpTemPro(req.codEmp, req.codTem, req.codPro)) {
            log.warn("Intento de crear productor duplicado: emp={}, tem={}, pro={}", req.codEmp, req.codTem, req.codPro);
            return fail(req.codPro, "Ya existe el código: " + req.codPro);
        }

        // 3) Resolver PRV_PRO / NIV_PRO / COD_PROVC desde CSV
        ComunaCsvDictionary.Entry e = comunas.find(req.comunaCodigo);
        if (e == null) {
            log.warn("comunaCodigo no existe en CSV: {}", req.comunaCodigo);
            return fail(req.codPro, "comunaCodigo no existe en CSV: " + req.comunaCodigo);
        }
        if (isBlank(e.provincia) || isBlank(e.region)) {
            log.warn("CSV incompleto para comuna {} (provincia/region vacías)", req.comunaCodigo);
            return fail(req.codPro, "CSV incompleto para comuna " + req.comunaCodigo + " (provincia/region vacías)");
        }

        // 4) Verificación proactiva de FK COMUNAS en BD (evita caer en excepción)
        if (!repo.existsComuna(req.comunaCodigo)) {
            log.warn("COD_COM={} no existe en BD (tabla COMUNAS)", req.comunaCodigo);
            return fail(req.codPro, "La comuna " + req.comunaCodigo + " no existe en BD (COMUNAS).");
        }

        // 5) Preparar el insert 1:1 (mismos campos que tu SQL)
        GuardarRequest p = new GuardarRequest();
        p.codEmp     = req.codEmp;
        p.codTem     = req.codTem;
        p.codPro     = req.codPro;
        p.nomPro     = req.nomPro;
        p.nomProCrt  = (req.nomPro == null ? "" : req.nomPro.trim());
        p.rutPro     = req.rutPro;
        p.dv         = req.dv;
        p.dirPro     = req.dirPro;
        p.ciuPro     = req.ciudad;
        p.prvPro     = e.provincia;
        p.nivPro     = e.region;
        p.zon        = req.zon;
        p.swInactivo = false;
        p.codCom     = req.comunaCodigo;
        p.codProvc   = e.provincia;
        p.ggn        = req.ggn;
        p.fax        = null;
        p.responsableProd = req.creadoPor;

        try {
            // 6) Insert productor
            repo.guardar(p);
            log.info("Productor creado OK: emp={}, tem={}, pro={}", req.codEmp, req.codTem, req.codPro);
        } catch (RuntimeException ex) {
            log.debug("Fallo insert productor pro={}: {}", req.codPro, ex.getMessage());
            return fail(req.codPro, ex.getMessage());
        }

        // 7) Vínculos con 0..N exportadores (compatibles con expCodigo/porc + exportadores[])
        List<ExpPair> vinculos = buildVinculos(req);
        if (vinculos.isEmpty()) {
            return ok(req.codPro, "OK");
        }

        int ok = 0;
        List<String> errores = new ArrayList<>();
        Integer temInt = tryParseInt(req.codTem);

        for (ExpPair it : vinculos) {
            // Verificación proactiva de existencia del exportador en la temporada (si codTem es numérico)
            if (temInt != null && !isBlank(it.expCodigo)) {
                boolean existe = exportRepo.existsByCodTem(it.expCodigo, temInt);
                if (!existe) {
                    String msg = "Exportador " + it.expCodigo + " no existe en la temporada " + req.codTem;
                    log.warn(msg);
                    errores.add(it.expCodigo + ": " + msg);
                    continue; // no intentamos insertar para evitar FK
                }
            }

            try {
                vxRepo.vincular(req.codPro, it.expCodigo, req.codTem, req.codEmp, it.porc);
                ok++;
            } catch (RuntimeException ex) {
                log.debug("Fallo vínculo pro={} exp={}: {}", req.codPro, it.expCodigo, ex.getMessage());
                errores.add(it.expCodigo + ": " + ex.getMessage());
            }
        }

        if (errores.isEmpty()) {
            return ok(req.codPro, "OK (" + ok + " vínculo(s))");
        } else {
            String msg = "OK parcial (" + ok + "/" + vinculos.size() + " vínculo(s)). Errores: " +
                    errores.stream().collect(Collectors.joining(" | "));
            return ok(req.codPro, msg);
        }
    }

    // ---- helpers ----
    private boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
    private Integer tryParseInt(String s) {
        try { return s == null ? null : Integer.parseInt(s.trim()); } catch (Exception e) { return null; }
    }
    private ProductorResponse fail(String codPro, String msg) {
        return new ProductorResponse(false, codPro, msg);
    }
    private ProductorResponse ok(String codPro, String msg) {
        return new ProductorResponse(true, codPro, msg);
    }

    private static class ExpPair {
        final String expCodigo;
        final Integer porc;
        ExpPair(String expCodigo, Integer porc) {
            this.expCodigo = expCodigo;
            this.porc = (porc == null ? 0 : porc);
        }
    }

    private List<ExpPair> buildVinculos(CrearProductorRequest req) {
        Map<String, ExpPair> map = new LinkedHashMap<>();

        // Compat (un solo exportador)
        if (!isBlank(req.expCodigo) || req.porc != null) {
            map.put(req.expCodigo, new ExpPair(req.expCodigo, req.porc));
        }

        // Lista de exportadores
        if (req.exportadores != null) {
            for (CrearProductorRequest.ExportadorItem it : req.exportadores) {
                if (it == null) continue;
                if (it.expCodigo == null || it.expCodigo.trim().isEmpty()) continue;
                map.put(it.expCodigo, new ExpPair(it.expCodigo, it.porc));
            }
        }

        return new ArrayList<>(map.values());
    }
}
