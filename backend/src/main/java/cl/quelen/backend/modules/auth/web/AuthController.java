package cl.quelen.backend.modules.auth.web;

import cl.quelen.backend.modules.auth.core.AuthResult;
import cl.quelen.backend.modules.auth.core.AuthService;
import cl.quelen.backend.modules.auth.web.dto.LoginRequest;
import cl.quelen.backend.modules.auth.web.dto.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/api/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        AuthResult result = auth.authenticate(req.userId, req.password);

        if (!result.isAuthenticated()) {
            // Mantengo contrato anterior: devolver "ERROR: ..." en tipo y el usuario original (si vino)
            String usuario = (req.userId != null ? req.userId : "");
            return ResponseEntity.ok(new LoginResponse(usuario, result.getTipo()));
        }

        return ResponseEntity.ok(new LoginResponse(result.getUserId(), result.getTipo()));
    }
}
