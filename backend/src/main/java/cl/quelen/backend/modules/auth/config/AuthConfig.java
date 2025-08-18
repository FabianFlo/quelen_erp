package cl.quelen.backend.modules.auth.config;

import cl.quelen.backend.modules.auth.application.usecase.AuthenticateUserService;
import cl.quelen.backend.modules.auth.domain.port.in.AuthenticateUser;
import cl.quelen.backend.modules.auth.domain.port.out.CredentialsGateway;
import cl.quelen.backend.modules.auth.domain.port.out.RoleGateway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthConfig {

    @Bean
    public AuthenticateUser authenticateUser(CredentialsGateway credentialsGateway,
                                             RoleGateway roleGateway) {
        // Caso de uso sin dependencias a Spring/JDBC: recibe interfaces
        return new AuthenticateUserService(credentialsGateway, roleGateway);
    }
}
