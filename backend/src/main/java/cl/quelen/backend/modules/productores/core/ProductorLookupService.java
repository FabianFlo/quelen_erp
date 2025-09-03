package cl.quelen.backend.modules.productores.core;

import cl.quelen.backend.modules.productores.persistence.ProductorLookupRepository;
import cl.quelen.backend.modules.productores.web.OpcionResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductorLookupService {

    private final ProductorLookupRepository repo;

    public ProductorLookupService(ProductorLookupRepository repo) {
        this.repo = repo;
    }

    // 🔹 Para productores por temporada
    public List<OpcionResponse> listarProductoresPorTemporada(String codTem) {
        return repo.listarProductoresPorTemporada(codTem);
    }

    // 🔹 Para predios por productor en temporada
    public List<OpcionResponse> listarPrediosPorProductor(String codTem, String codPro) {
        return repo.listarPrediosPorProductor(codTem, codPro);
    }
}
