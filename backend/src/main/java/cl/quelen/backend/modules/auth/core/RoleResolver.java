package cl.quelen.backend.modules.auth.core;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Resolución de rol simple (idéntica a tu InMemoryRoleAdapter).
 * Si mañana quieres mover a SQL, solo cambia esta clase.
 */
@Component
public class RoleResolver {

    private final List<String> adminUsers = Arrays.asList("esupulveda", "jgarces", "fflores");
    private final List<String> patioUsers = Arrays.asList("jverdejo", "srivas");
    private final List<String> normalUsers = Arrays.asList("user1", "user2");

    /** Retorna "A" (admin), "P" (patio) o "U" (usuario) */
    public String resolve(String normalizedUsername) {
        if (normalizedUsername == null) return "U";
        if (adminUsers.contains(normalizedUsername)) return "A";
        if (patioUsers.contains(normalizedUsername)) return "P";
        if (normalUsers.contains(normalizedUsername)) return "U";
        return "U";
    }
}
