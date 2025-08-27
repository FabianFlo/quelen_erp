package cl.quelen.backend.modules.productores.domain.port.in;

public interface CrearProductor {
    Result handle(Command c);

    final class Command {
        // Requeridos
        public final String codEmp;
        public final String codTem;
        public final String codPro;
        public final String nomPro;
        public final String zon;

        // Dirección y documentos
        public final Integer rutPro;
        public final String dv;
        public final String dirPro;
        public final String ggn;

        // Comuna (input del usuario): puede enviar código o nombre
        public final String comunaCodigo;
        public final String comunaNombre;

        // Ciudad libre que se guardará en CIU_PRO
        public final String ciudad;
        
        // NUEVO: responsable (usuario que crea el productor)
        public final String creadoPor;

        public Command(String codEmp, String codTem, String codPro, String nomPro, String zon,
                       Integer rutPro, String dv, String dirPro, String ggn,
                       String comunaCodigo, String comunaNombre,
                       String ciudad, String creadoPor) {
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
            this.ciudad = ciudad;
            this.creadoPor = creadoPor;
        }
    }

    final class Result {
        public final boolean created;
        public final String codPro;
        public final String message;
        private Result(boolean created, String codPro, String message) {
            this.created = created; this.codPro = codPro; this.message = message;
        }
        public static Result ok(String codPro) { return new Result(true, codPro, "OK"); }
        public static Result error(String msg) { return new Result(false, null, msg); }
    }
}
