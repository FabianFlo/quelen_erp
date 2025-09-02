package cl.quelen.backend.modules.auth.web.dto;

public class LoginResponse {
    public String usuario; // mantenemos "usuario" como antes
    public String tipo;    // "A", "P", "U" o "ERROR: ..."

    public LoginResponse() {}

    public LoginResponse(String usuario, String tipo) {
        this.usuario = usuario;
        this.tipo = tipo;
    }
}
