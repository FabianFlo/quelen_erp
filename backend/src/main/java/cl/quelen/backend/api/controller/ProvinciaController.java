// src/main/java/cl/quelen/backend/api/controller/ProvinciaController.java
package cl.quelen.backend.api.controller;

import cl.quelen.backend.services.ProvinciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/provincias")
public class ProvinciaController {

    private final ProvinciaService provinciaService;

    public ProvinciaController(ProvinciaService provinciaService) {
        this.provinciaService = provinciaService;
    }

    // GET /api/provincias/{codTem}  (acepta "7")
    @GetMapping("/{codTem}")
    public ResponseEntity<?> obtenerProvincias(@PathVariable String codTem) {
        if (codTem == null || codTem.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("codTem es requerido");
        }
        List<String> resultado = provinciaService.listarProvinciasPorTem(codTem.trim());
        return ResponseEntity.ok(resultado);
    }
}
