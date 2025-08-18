package cl.quelen.backend.modules.maestrosgeo.domain.port.in;

import cl.quelen.backend.modules.maestrosgeo.domain.model.ComunaFull;

public interface ResolveComuna {
    Result handle(Query q);

    final class Query {
        public final String codigo; // puede venir null
        public final String nombre; // puede venir null
        public Query(String codigo, String nombre) { this.codigo = codigo; this.nombre = nombre; }
    }

    final class Result {
        public final boolean found;
        public final ComunaFull comuna;
        public final String error;
        private Result(boolean found, ComunaFull comuna, String error) { this.found = found; this.comuna = comuna; this.error = error; }
        public static Result ok(ComunaFull c) { return new Result(true, c, null); }
        public static Result notFound(String msg) { return new Result(false, null, msg); }
    }
}
