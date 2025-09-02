package cl.quelen.backend.modules.auth.core;

import cl.quelen.backend.modules.auth.persistence.CredentialsRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final CredentialsRepository credentials;
    private final RoleResolver roleResolver;

    public AuthService(CredentialsRepository credentials, RoleResolver roleResolver) {
        this.credentials = credentials;
        this.roleResolver = roleResolver;
    }

    public AuthResult authenticate(String userId, String password) {
        if (userId == null || userId.trim().isEmpty() || password == null) {
            return AuthResult.error("ERROR: Usuario y/o contraseña inválidos");
        }

        // Verifica en SQL Server (syslogins + PWDCOMPARE)
        String normalized = credentials.verify(userId, password);
        if (normalized == null) {
            return AuthResult.error("ERROR: Usuario y/o contraseña incorrectos");
        }

        // Resuelve tipo/rol (A, P, U)
        String tipo = roleResolver.resolve(normalized);
        return AuthResult.ok(normalized, tipo);
    }
}
