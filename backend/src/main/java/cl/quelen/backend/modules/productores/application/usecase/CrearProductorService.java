package cl.quelen.backend.modules.productores.application.usecase;

import cl.quelen.backend.modules.maestrosgeo.domain.model.ComunaFull;
import cl.quelen.backend.modules.maestrosgeo.domain.port.in.ResolveComuna;
import cl.quelen.backend.modules.productores.domain.model.Productor;
import cl.quelen.backend.modules.productores.domain.port.in.CrearProductor;
import cl.quelen.backend.modules.productores.domain.port.out.GuardarProductorPort;
import cl.quelen.backend.modules.productores.domain.port.out.GuardarProductorExportadorPort;


public class CrearProductorService implements CrearProductor {

    private final GuardarProductorPort guardarPort;
    private final GuardarProductorExportadorPort guardarProdExpPort;
    private final ResolveComuna resolveComuna;

    public CrearProductorService(GuardarProductorPort guardarPort, 
                                GuardarProductorExportadorPort guardarProdExpPort, 
                                ResolveComuna resolveComuna) {
        this.guardarPort = guardarPort;
        this.guardarProdExpPort = guardarProdExpPort;
        this.resolveComuna = resolveComuna;
    }

    @Override
    public Result handle(Command c) {
        if (isBlank(c.codEmp) || isBlank(c.codTem) || isBlank(c.codPro) || isBlank(c.nomPro) || isBlank(c.zon)) {
            return Result.error("Faltan datos obligatorios: COD_EMP, COD_TEM, COD_PRO, NOM_PRO, ZON");
        }

        ResolveComuna.Result r = resolveComuna.handle(new ResolveComuna.Query(
                emptyToNull(c.comunaCodigo),
                emptyToNull(c.comunaNombre)
        ));
        if (!r.found) {
            return Result.error("Comuna no encontrada: " + (c.comunaCodigo != null ? c.comunaCodigo : c.comunaNombre));
        }
        ComunaFull cf = r.comuna;

        // CIU_PRO = lo que vino del front (truncado a 15)
        String ciuProValor  = left(safe(c.ciudad), 15);

        // PRV_PRO = CÓDIGO de provincia ; NIV_PRO = CÓDIGO de región
        String prvProCodigo = left(cf.getProvinciaCodigo(), 15);
        String nivProCodigo = left(cf.getRegionCodigo(), 8);

        // Entidad de dominio
        Productor p = new Productor(
                c.codEmp.trim(),
                c.codTem.trim(),
                c.codPro.trim(),
                c.nomPro.trim(),
                c.rutPro == null ? 0 : c.rutPro,
                safe(c.dv),
                safe(c.dirPro),
                ciuProValor,
                prvProCodigo,
                c.zon.trim(),
                cf.getComunaCodigo(),
                cf.getProvinciaCodigo(),
                safe(c.ggn)
        );

        // Nombre corto
        String nomProCrt = buildNombreCorto(p.nomPro, 30);

        boolean swInactivo = false;   // activo al crear
        String fax = p.ggn;           // FAX = GGN

        GuardarProductorPort.GuardarRequest req = GuardarProductorPort.GuardarRequest.fromDomain(
                p,
                nomProCrt,
                swInactivo,
                fax,
                nivProCodigo,          // NIV_PRO = código región
                prvProCodigo,          // PRV_PRO = código provincia
                c.creadoPor            // <<<<< nuevo campo que viene del DTO
        );

        guardarPort.guardar(req);
        
        if (c.expCodigo != null && !c.expCodigo.trim().isEmpty()) {
            guardarProdExpPort.guardar(c.codEmp, c.codTem, c.codPro, c.expCodigo.trim(), 0);
        }

        return Result.ok(p.codPro);
    }

    // ==== helpers ====
    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
    private static String safe(String s) { return s == null ? "" : s.trim(); }
    private static String left(String s, int max) {
        if (s == null) return "";
        String t = s.trim();
        return t.length() <= max ? t : t.substring(0, max);
    }
    private static String emptyToNull(String s) { return (s == null || s.trim().isEmpty()) ? null : s.trim(); }

    private static String buildNombreCorto(String texto, int maxLen) {
        if (texto == null) return "";
        String t = texto.trim().replaceAll("\\s+", " ");
        if (t.length() <= maxLen) return t;
        String[] words = t.split(" ");
        StringBuilder sb = new StringBuilder();
        for (String w : words) {
            if (sb.length() == 0) {
                if (w.length() > maxLen) return w.substring(0, maxLen);
                sb.append(w);
            } else {
                int nextLen = sb.length() + 1 + w.length();
                if (nextLen <= maxLen) sb.append(' ').append(w);
                else break;
            }
        }
        return sb.toString();
    }
}
