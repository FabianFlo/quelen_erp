// src/main/java/cl/quelen/backend/api/controller/ComunaController.java
package cl.quelen.backend.api.controller;

import cl.quelen.backend.services.ComunaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comunas")
public class ComunaController {

    private final ComunaService comunaService;

    public ComunaController(ComunaService comunaService) {
        this.comunaService = comunaService;
    }

    // GET /api/comunas/{codTem}  (acepta "7")
    @GetMapping("/{codTem}")
    public ResponseEntity<?> obtenerComunas(@PathVariable String codTem) {
        if (codTem == null || codTem.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("codTem es requerido");
        }
        List<String> resultado = comunaService.listarComunasPorTem(codTem.trim());
        return ResponseEntity.ok(resultado);
    }
}
