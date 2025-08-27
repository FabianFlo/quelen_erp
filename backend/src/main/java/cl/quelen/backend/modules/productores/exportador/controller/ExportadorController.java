package cl.quelen.erp.productores.exportador.controller;

import cl.quelen.erp.productores.exportador.domain.ExportadorRef;
import cl.quelen.erp.productores.exportador.domain.ExportadorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productores/exportador")
public class ExportadorController {

    private final ExportadorRepository repo;

    public ExportadorController(ExportadorRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{codTem}")
    public ResponseEntity<?> obtenerExportadores(@PathVariable String codTem) {
        if (codTem == null || codTem.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("codTem es requerido");
        }
        int temporada;
        try {
            temporada = Integer.parseInt(codTem.trim());
        } catch (NumberFormatException ex) {
            return ResponseEntity.badRequest().body("codTem debe ser numérico");
        }

        List<ExportadorRef> data = repo.findByTemporada(temporada);
        List<String> resultado = data.stream()
                .map(e -> e.getCodExp() + " - " + e.getNomExp())
                .toList();

        return ResponseEntity.ok(resultado);
    }
}
