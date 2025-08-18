package cl.quelen.backend.modules.auth.domain.port.out;

public interface CredentialsGateway {
    /**
     * Verifica credenciales contra la fuente (SQL Server/AD/etc).
     * Debe retornar el "username normalizado" (p.ej. en minúsculas) si son correctas,
     * o null si no existen / no coinciden.
     */
    String verify(String userId, String password);
}
