package cl.quelen.backend.modules.maestrosgeo.adapters.in.web.controller;

import cl.quelen.backend.modules.maestrosgeo.domain.model.Comuna;
import cl.quelen.backend.modules.maestrosgeo.domain.port.in.ListarComunasPorTem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comunas")
public class ComunaController {

    private final ListarComunasPorTem listarComunasPorTem;

    public ComunaController(ListarComunasPorTem listarComunasPorTem) {
        this.listarComunasPorTem = listarComunasPorTem;
    }

    @GetMapping("/{codTem}")
    public ResponseEntity<?> obtenerComunas(@PathVariable String codTem) {
        if (codTem == null || codTem.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("codTem es requerido");
        }
        List<Comuna> comunas = listarComunasPorTem.handle(codTem.trim());
        List<String> resultado = comunas.stream()
                .map(c -> c.getCodigo() + " - " + c.getDescripcion())
                .toList();
        return ResponseEntity.ok(resultado);
    }
}
