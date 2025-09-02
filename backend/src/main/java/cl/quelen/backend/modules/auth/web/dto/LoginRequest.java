package cl.quelen.backend.modules.auth.web.dto;

public class LoginRequest {
    public String userId;
    public String password;

    public LoginRequest() {}
    public LoginRequest(String userId, String password) {
        this.userId = userId;
        this.password = password;
    }
}
