package cl.quelen.backend.modules.productores.exportador.web;

import cl.quelen.backend.modules.productores.exportador.core.ExportadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productores/exportador")
public class ExportadorController {

    private final ExportadorService service;

    public ExportadorController(ExportadorService service) {
        this.service = service;
    }

    @GetMapping("/{codTem}")
    public ResponseEntity<?> obtenerExportadores(@PathVariable String codTem) {
        if (codTem == null || codTem.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("codTem es requerido");
        }
        final int temporada;
        try {
            temporada = Integer.parseInt(codTem.trim());
        } catch (NumberFormatException ex) {
            return ResponseEntity.badRequest().body("codTem debe ser numérico");
        }

        List<String> resultado = service.listarPorTemporada(temporada);
        return ResponseEntity.ok(resultado);
    }
}
