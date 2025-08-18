package cl.quelen.backend.modules.auth.application.usecase;

import cl.quelen.backend.modules.auth.domain.model.AuthResult;
import cl.quelen.backend.modules.auth.domain.port.in.AuthenticateUser;
import cl.quelen.backend.modules.auth.domain.port.out.CredentialsGateway;
import cl.quelen.backend.modules.auth.domain.port.out.RoleGateway;

public class AuthenticateUserService implements AuthenticateUser {

    private final CredentialsGateway credentialsGateway;
    private final RoleGateway roleGateway;

    public AuthenticateUserService(CredentialsGateway credentialsGateway, RoleGateway roleGateway) {
        this.credentialsGateway = credentialsGateway;
        this.roleGateway = roleGateway;
    }

    @Override
    public AuthResult handle(Command cmd) {
        if (cmd == null || cmd.userId == null || cmd.password == null) {
            return AuthResult.error("ERROR: Datos de login inválidos");
        }

        String normalized = credentialsGateway.verify(cmd.userId, cmd.password);
        if (normalized == null) {
            // Mantengo semántica parecida a tu servicio original
            return AuthResult.error("ERROR: Usuario no encontrado o contraseña incorrecta");
        }

        String tipo = roleGateway.resolve(normalized);
        return AuthResult.ok(normalized, tipo);
    }
}
