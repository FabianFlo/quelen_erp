package cl.quelen.erp.productores.exportador.dto;

public class ExportadorDto {

    private Integer codExp;
    private String nomExp;

    public ExportadorDto(Integer codExp, String nomExp) {
        this.codExp = codExp;
        this.nomExp = nomExp;
    }

    public Integer getCodExp() { return codExp; }
    public String getNomExp() { return nomExp; }
}
