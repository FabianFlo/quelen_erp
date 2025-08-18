package cl.quelen.backend.modules.productores.adapters.in.web.controller;

import cl.quelen.backend.modules.productores.adapters.in.web.dto.CrearProductorRequest;
import cl.quelen.backend.modules.productores.adapters.in.web.dto.ProductorResponse;
import cl.quelen.backend.modules.productores.domain.port.in.CrearProductor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/productores")
public class ProductorController {

    private final CrearProductor crearProductor;

    public ProductorController(CrearProductor crearProductor) {
        this.crearProductor = crearProductor;
    }

    @PostMapping
    public ResponseEntity<ProductorResponse> crear(@RequestBody CrearProductorRequest req) {
        var cmd = new CrearProductor.Command(
                req.codEmp, req.codTem, req.codPro, req.nomPro, req.zon,
                req.rutPro, req.dv, req.dirPro, req.ggn,
                req.comunaCodigo, req.comunaNombre
        );
        var result = crearProductor.handle(cmd);
        return ResponseEntity.ok(new ProductorResponse(result.created, result.codPro, result.message));
    }
}
