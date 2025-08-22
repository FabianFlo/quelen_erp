package cl.quelen.backend.modules.productores.domain.port.out;

import cl.quelen.backend.modules.productores.domain.model.Productor;

public interface GuardarProductorPort {

    void guardar(GuardarRequest p);
      
    final class GuardarRequest {
        // Obligatorios / negocio
        public final String codEmp;
        public final String codTem;
        public final String codPro;
        public final String nomPro;
        public final String nomProCrt; // nombre corto calculado en application
        public final String zon;

        // Dirección / documentos
        public final Integer rutPro; // puede ser null -> se normaliza antes
        public final String dv;
        public final String dirPro;

        // Geografía (lo que se guarda en la BDD)
        public final String ciuPro;   // NOMBRE de comuna (máx 15)
        public final String prvPro;   // CÓDIGO de provincia (ej. "135")
        public final String nivPro;   // CÓDIGO de región (ej. "13")
        public final String codCom;   // CÓDIGO comuna
        public final String codProvc; // CÓDIGO provincia

        // Otros
        public final String ggn;
        public final String fax;         // igual a ggn
        public final boolean swInactivo; // true = inactivo

        public GuardarRequest(String codEmp, String codTem, String codPro, String nomPro, String nomProCrt,
                              String zon, Integer rutPro, String dv, String dirPro,
                              String ciuPro, String prvPro, String nivPro, String codCom, String codProvc,
                              String ggn, String fax, boolean swInactivo) {
            this.codEmp = codEmp;
            this.codTem = codTem;
            this.codPro = codPro;
            this.nomPro = nomPro;
            this.nomProCrt = nomProCrt;
            this.zon = zon;
            this.rutPro = rutPro;
            this.dv = dv;
            this.dirPro = dirPro;
            this.ciuPro = ciuPro;
            this.prvPro = prvPro;
            this.nivPro = nivPro;
            this.codCom = codCom;
            this.codProvc = codProvc;
            this.ggn = ggn;
            this.fax = fax;
            this.swInactivo = swInactivo;
        }

        public static GuardarRequest fromDomain(Productor p,
                                                String nomProCrt,
                                                boolean swInactivo,
                                                String fax,
                                                String nivPro,
                                                String prvPro) {
            return new GuardarRequest(
                p.codEmp, p.codTem, p.codPro, p.nomPro, nomProCrt,
                p.zon, p.rutPro, p.dv, p.dirPro,
                p.ciuPro, prvPro, nivPro, p.codCom, p.codProvc,
                p.ggn, fax, swInactivo
            );
        }
    }
}
