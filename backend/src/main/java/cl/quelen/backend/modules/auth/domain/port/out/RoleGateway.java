package cl.quelen.backend.modules.auth.domain.port.out;

public interface RoleGateway {
    /**
     * Resuelve el tipo de usuario: "A" (Admin), "P" (Patio), "U" (Usuario).
     * Si no mapea, debe retornar "U" por defecto.
     */
    String resolve(String normalizedUsername);
}
