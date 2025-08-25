package cl.quelen.backend.modules.auth.adapters.in.web.controller;

import cl.quelen.backend.modules.auth.adapters.in.web.dto.LoginRequest;
import cl.quelen.backend.modules.auth.adapters.in.web.dto.LoginResponse;
import cl.quelen.backend.modules.auth.domain.model.AuthResult;
import cl.quelen.backend.modules.auth.domain.port.in.AuthenticateUser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class AuthController {

    private final AuthenticateUser authenticateUser;

    public AuthController(AuthenticateUser authenticateUser) {
        this.authenticateUser = authenticateUser;
    }

    @PostMapping("/api/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        var result = authenticateUser.handle(new AuthenticateUser.Command(req.userId, req.password));

        if (!result.isAuthenticated()) {
            // Mantengo contrato: devolver "ERROR: ..." en tipo y usuario original si vino
            String usuario = (req.userId != null ? req.userId : "");
            return ResponseEntity.ok(new LoginResponse(usuario, result.getTipo()));
        }

        return ResponseEntity.ok(new LoginResponse(result.getUserId(), result.getTipo()));
    }
}
