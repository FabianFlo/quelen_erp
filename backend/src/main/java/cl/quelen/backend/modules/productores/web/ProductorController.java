package cl.quelen.backend.modules.productores.web;

import cl.quelen.backend.modules.productores.web.dto.CrearProductorRequest;
import cl.quelen.backend.modules.productores.web.dto.ProductorResponse;
import cl.quelen.backend.modules.productores.core.ProductorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/productores")
public class ProductorController {

    private final ProductorService service;

    public ProductorController(ProductorService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ProductorResponse> crear(@RequestBody CrearProductorRequest req) {
        // Devolvemos 200 siempre; los errores de negocio van en el body para no ensuciar consola del front
        return ResponseEntity.ok(service.crear(req));
    }
}
