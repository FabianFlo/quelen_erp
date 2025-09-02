package cl.quelen.backend.modules.maestrosgeo.web;

import cl.quelen.backend.modules.maestrosgeo.core.Comuna;
import cl.quelen.backend.modules.maestrosgeo.core.ComunaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comunas")
public class ComunaController {

    private final ComunaService service;

    public ComunaController(ComunaService service) {
        this.service = service;
    }

    // GET /api/comunas/{codTem} -> ["CODIGO - DESCRIPCION", ...]
    @GetMapping("/{codTem}")
    public ResponseEntity<?> listarComunasCodigoDescripcionPorTem(@PathVariable String codTem) {
        if (codTem == null || codTem.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("codTem es requerido");
        }

        List<String> out = service.listarCodigoDescripcionPorTem(codTem).stream()
            .map(c -> (c.getCodigo() != null ? c.getCodigo() : "") +
                      " - " +
                      (c.getDescripcion() != null ? c.getDescripcion() : ""))
            .collect(Collectors.toList());

        return ResponseEntity.ok(out);
    }
}
