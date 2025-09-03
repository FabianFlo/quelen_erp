package cl.quelen.backend.modules.productores.web;

import cl.quelen.backend.modules.productores.core.ProductorLookupService;
import cl.quelen.backend.modules.productores.web.OpcionResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productores")
public class ProductorLookupController {

    private final ProductorLookupService service;

    public ProductorLookupController(ProductorLookupService service) {
        this.service = service;
    }

    // 🔹 GET /api/productores/{codTem}/lookup
    @GetMapping("/{codTem}/lookup")
    public ResponseEntity<List<OpcionResponse>> lookupProductores(@PathVariable String codTem) {
        return ResponseEntity.ok(service.listarProductoresPorTemporada(codTem));
    }

    // 🔹 GET /api/productores/{codTem}/{codPro}/predios
    @GetMapping("/{codTem}/{codPro}/predios")
    public ResponseEntity<List<OpcionResponse>> lookupPredios(
            @PathVariable String codTem,
            @PathVariable String codPro) {
        return ResponseEntity.ok(service.listarPrediosPorProductor(codTem, codPro));
    }
}
