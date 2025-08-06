package cl.quelen.backend.controller;

import cl.quelen.backend.dto.LoginRequest;
import cl.quelen.backend.services.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {

    @Autowired
    private LoginService loginService;

   @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest loginRequest) {
        String userId = loginRequest.getUserId();
        String password = loginRequest.getPassword();
        String tipo = loginService.login(userId, password);

        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("usuario", userId);
        respuesta.put("tipo", tipo);

        return respuesta;
    }
}
