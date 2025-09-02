package cl.quelen.backend.modules.auth.core;

public class AuthResult {
    private final boolean authenticated;
    private final String userId;
    private final String tipo;

    private AuthResult(boolean authenticated, String userId, String tipo) {
        this.authenticated = authenticated;
        this.userId = userId;
        this.tipo = tipo;
    }

    public static AuthResult ok(String userId, String tipo) {
        return new AuthResult(true, userId, tipo);
    }

    public static AuthResult error(String messageTipo) {
        return new AuthResult(false, null, messageTipo != null ? messageTipo : "ERROR");
    }

    public boolean isAuthenticated() { return authenticated; }
    public String getUserId() { return userId; }
    public String getTipo() { return tipo; }
}
