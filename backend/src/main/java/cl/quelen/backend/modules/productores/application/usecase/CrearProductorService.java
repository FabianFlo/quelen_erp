package cl.quelen.backend.modules.productores.application.usecase;

import cl.quelen.backend.modules.maestrosgeo.domain.model.ComunaFull;
import cl.quelen.backend.modules.maestrosgeo.domain.port.in.ResolveComuna;
import cl.quelen.backend.modules.productores.domain.model.Productor;
import cl.quelen.backend.modules.productores.domain.port.in.CrearProductor;
import cl.quelen.backend.modules.productores.domain.port.out.GuardarProductorPort;

public class CrearProductorService implements CrearProductor {

    private final GuardarProductorPort guardarPort;
    private final ResolveComuna resolveComuna;

    public CrearProductorService(GuardarProductorPort guardarPort, ResolveComuna resolveComuna) {
        this.guardarPort = guardarPort;
        this.resolveComuna = resolveComuna;
    }

    @Override
    public Result handle(Command c) {
        // Validaciones mínimas obligatorias por BDD
        if (isBlank(c.codEmp) || isBlank(c.codTem) || isBlank(c.codPro) || isBlank(c.nomPro) || isBlank(c.zon)) {
            return Result.error("Faltan datos obligatorios: COD_EMP, COD_TEM, COD_PRO, NOM_PRO, ZON");
        }

        // Resolver comuna (por código o por nombre)
        ResolveComuna.Result r = resolveComuna.handle(new ResolveComuna.Query(
                emptyToNull(c.comunaCodigo),
                emptyToNull(c.comunaNombre)
        ));
        if (!r.found) {
            return Result.error("Comuna no encontrada: " + (c.comunaCodigo != null ? c.comunaCodigo : c.comunaNombre));
        }
        ComunaFull cf = r.comuna;

        // Mapear CIU_PRO = nombre comuna (máx 15), PRV_PRO = nombre provincia (máx 15)
        String ciuPro = left(cf.getComunaNombre(), 15);
        String prvPro = left(cf.getProvinciaNombre(), 15);

        Productor p = new Productor(
                c.codEmp.trim(),
                c.codTem.trim(),
                c.codPro.trim(),
                c.nomPro.trim(),
                c.rutPro == null ? 0 : c.rutPro,
                safe(c.dv),
                safe(c.dirPro),
                ciuPro,
                prvPro,
                c.zon.trim(),
                cf.getComunaCodigo(),
                cf.getProvinciaCodigo(),
                safe(c.ggn)
        );

        guardarPort.guardar(p);
        return Result.ok(p.codPro);
    }

    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
    private static String safe(String s) { return s == null ? "" : s.trim(); }
    private static String left(String s, int max) {
        if (s == null) return "";
        String t = s.trim();
        return t.length() <= max ? t : t.substring(0, max);
    }
    private static String emptyToNull(String s) { return (s == null || s.trim().isEmpty()) ? null : s.trim(); }
}
