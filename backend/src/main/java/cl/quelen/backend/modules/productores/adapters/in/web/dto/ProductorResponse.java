package cl.quelen.backend.modules.productores.adapters.in.web.dto;

public class ProductorResponse {
    public boolean created;
    public String codPro;
    public String message;

    public ProductorResponse(boolean created, String codPro, String message) {
        this.created = created;
        this.codPro = codPro;
        this.message = message;
    }
}
