package cl.quelen.backend.modules.auth.domain.port.in;

import cl.quelen.backend.modules.auth.domain.model.AuthResult;

public interface AuthenticateUser {
    AuthResult handle(Command cmd);

    final class Command {
        public final String userId;
        public final String password;

        public Command(String userId, String password) {
            this.userId = userId;
            this.password = password;
        }
    }
}
