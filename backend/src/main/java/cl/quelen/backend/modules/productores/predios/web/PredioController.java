package cl.quelen.backend.modules.productores.predios.web;

import cl.quelen.backend.modules.productores.predios.core.PredioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predios")
public class PredioController {

    private final PredioService service;

    public PredioController(PredioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PredioResponse> crear(@RequestBody CrearPredioRequest req) {
        try {
            return ResponseEntity.ok(service.crear(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new PredioResponse(false, req.codPre, e.getMessage()));
        }
    }
}
