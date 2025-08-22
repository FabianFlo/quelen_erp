package cl.quelen.backend.modules.auth.adapters.out.memory;

import cl.quelen.backend.modules.auth.domain.port.out.RoleGateway;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class InMemoryRoleAdapter implements RoleGateway {

    private final List<String> adminUsers = Arrays.asList("esupulveda", "jgarces", "fflores");
    private final List<String> patioUsers = Arrays.asList("jverdejo", "srivas");
    private final List<String> normalUsers = Arrays.asList("user1", "user2");

    @Override
    public String resolve(String normalizedUsername) {
        if (normalizedUsername == null) return "U";
        if (adminUsers.contains(normalizedUsername)) return "A";
        if (patioUsers.contains(normalizedUsername)) return "P";
        if (normalUsers.contains(normalizedUsername)) return "U";
        return "U"; // por defecto
    }
}
