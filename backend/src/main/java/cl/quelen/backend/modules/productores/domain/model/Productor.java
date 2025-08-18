package cl.quelen.backend.modules.productores.domain.model;

public class Productor {
    // Campos clave que vamos a persistir (los demás quedan con default/0 en SQL)
    public final String codEmp;      // NOT NULL
    public final String codTem;      // NOT NULL (vendrá de env fija)
    public final String codPro;      // NOT NULL (código productor, ej. "A5001")
    public final String nomPro;      // NOT NULL
    public final Integer rutPro;     // puede ser null -> lo tratamos como 0 si no viene
    public final String dv;          // puede ser null
    public final String dirPro;      // dirección, puede ser null
    public final String ciuPro;      // ciudad (usaremos NOMBRE COMUNA truncado a 15)
    public final String prvPro;      // provincia (NOMBRE PROVINCIA truncado a 15)
    public final String zon;         // NOT NULL (negocio)
    public final String codCom;      // código comuna (varchar, ej. "13302")
    public final String codProvc;    // código provincia (varchar, ej. "133")
    public final String ggn;         // puede ser null

    public Productor(String codEmp, String codTem, String codPro, String nomPro,
                     Integer rutPro, String dv, String dirPro,
                     String ciuPro, String prvPro, String zon,
                     String codCom, String codProvc, String ggn) {
        this.codEmp = codEmp;
        this.codTem = codTem;
        this.codPro = codPro;
        this.nomPro = nomPro;
        this.rutPro = rutPro;
        this.dv = dv;
        this.dirPro = dirPro;
        this.ciuPro = ciuPro;
        this.prvPro = prvPro;
        this.zon = zon;
        this.codCom = codCom;
        this.codProvc = codProvc;
        this.ggn = ggn;
    }
}
