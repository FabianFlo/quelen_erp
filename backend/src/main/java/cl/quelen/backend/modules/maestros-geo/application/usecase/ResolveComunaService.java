package cl.quelen.backend.modules.maestrosgeo.application.usecase;

import cl.quelen.backend.modules.maestrosgeo.domain.model.ComunaFull;
import cl.quelen.backend.modules.maestrosgeo.domain.port.in.ResolveComuna;
import cl.quelen.backend.modules.maestrosgeo.domain.port.out.ComunaDictionary;

import java.text.Normalizer;

public class ResolveComunaService implements ResolveComuna {

    private final ComunaDictionary dict;

    public ResolveComunaService(ComunaDictionary dict) {
        this.dict = dict;
    }

    @Override
    public Result handle(Query q) {
        if (q == null || (isBlank(q.codigo) && isBlank(q.nombre))) {
            return Result.notFound("Debe enviar código o nombre de comuna");
        }
        if (!isBlank(q.codigo)) {
            ComunaFull c = dict.findByCodigo(q.codigo.trim());
            return c != null ? Result.ok(c) : Result.notFound("Comuna no encontrada por código: " + q.codigo);
        }
        String norm = normalize(q.nombre);
        ComunaFull c = dict.findByNombre(norm);
        return c != null ? Result.ok(c) : Result.notFound("Comuna no encontrada por nombre: " + q.nombre);
    }

    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }

    private static String normalize(String s) {
        if (s == null) return null;
        String t = s.trim().toLowerCase();
        t = Normalizer.normalize(t, Normalizer.Form.NFD).replaceAll("\\p{M}+", "");
        t = t.replaceAll("\\s+", " ");
        return t;
    }
}
