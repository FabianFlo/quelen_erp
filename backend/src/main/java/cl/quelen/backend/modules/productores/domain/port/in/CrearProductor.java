package cl.quelen.backend.modules.productores.domain.port.in;

import cl.quelen.backend.modules.productores.domain.model.Productor;

public interface CrearProductor {
    Result handle(Command c);

    final class Command {
        // Requeridos
        public final String codEmp;   // ej. "MER" (de env)
        public final String codTem;   // ej. "7" (de env)
        public final String codPro;   // ej. "A5001"
        public final String nomPro;   // ej. "AGRICOLA LA CARRERA LTDA"
        public final String zon;      // NOT NULL por BDD

        // Direccion y documentos
        public final Integer rutPro;  // ej. 77128700
        public final String dv;       // "K"
        public final String dirPro;   // "FUNDO ..."
        public final String ggn;      // opcional

        // Comuna (input del usuario): puede enviar código o nombre
        public final String comunaCodigo; // puede venir null si envía nombre
        public final String comunaNombre; // puede venir null si envía código

        public Command(String codEmp, String codTem, String codPro, String nomPro, String zon,
                       Integer rutPro, String dv, String dirPro, String ggn,
                       String comunaCodigo, String comunaNombre) {
            this.codEmp = codEmp;
            this.codTem = codTem;
            this.codPro = codPro;
            this.nomPro = nomPro;
            this.zon = zon;
            this.rutPro = rutPro;
            this.dv = dv;
            this.dirPro = dirPro;
            this.ggn = ggn;
            this.comunaCodigo = comunaCodigo;
            this.comunaNombre = comunaNombre;
        }
    }

    final class Result {
        public final boolean created;
        public final String codPro;
        public final String message;
        private Result(boolean created, String codPro, String message) { this.created = created; this.codPro = codPro; this.message = message; }
        public static Result ok(String codPro) { return new Result(true, codPro, "OK"); }
        public static Result error(String msg) { return new Result(false, null, msg); }
    }
}
