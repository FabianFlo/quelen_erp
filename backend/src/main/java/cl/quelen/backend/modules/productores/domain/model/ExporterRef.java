package cl.quelen.erp.productores.domain.model;

public class ExporterRef {
    private final Integer codExp;
    private final Integer codTem;
    private final String nomExp; // opcional, informativo

    public ExporterRef(Integer codExp, Integer codTem, String nomExp) {
        this.codExp = codExp;
        this.codTem = codTem;
        this.nomExp = nomExp;
    }
    public Integer getCodExp() { return codExp; }
    public Integer getCodTem() { return codTem; }
    public String getNomExp() { return nomExp; }
}
