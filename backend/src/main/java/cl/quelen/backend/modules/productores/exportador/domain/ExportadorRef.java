package cl.quelen.erp.productores.exportador.domain;

/** Proyección liviana del SELECT; no es entidad JPA. */
public class ExportadorRef {

    private final Integer codExp;
    private final String nomExp;

    public ExportadorRef(Integer codExp, String nomExp) {
        this.codExp = codExp;
        this.nomExp = nomExp;
    }

    public Integer getCodExp() { return codExp; }
    public String getNomExp() { return nomExp; }
}
