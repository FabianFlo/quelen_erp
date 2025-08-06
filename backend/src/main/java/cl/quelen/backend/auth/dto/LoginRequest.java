package cl.quelen.backend.dto;

public class LoginRequest {
    private String userId;
    private String password;

    // Getters y setters
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
