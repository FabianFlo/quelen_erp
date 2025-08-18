package cl.quelen.backend.modules.auth.adapters.in.web.dto;

public class LoginResponse {
    public String usuario;
    public String tipo;

    public LoginResponse(String usuario, String tipo) {
        this.usuario = usuario;
        this.tipo = tipo;
    }
}
