package cl.quelen.backend.modules.productores.predios.web;

public class PredioResponse {
    public boolean created;
    public String codPre;
    public String message;

    public PredioResponse(boolean created, String codPre, String message) {
        this.created = created;
        this.codPre = codPre;
        this.message = message;
    }
}
