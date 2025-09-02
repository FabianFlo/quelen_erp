package cl.quelen.backend.modules.productores.exportador.core;

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
