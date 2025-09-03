package cl.quelen.backend.modules.productores.predios.core;

import cl.quelen.backend.modules.productores.core.ComunaCsvDictionary;
import cl.quelen.backend.modules.productores.core.ComunaCsvDictionary.Entry;
import cl.quelen.backend.modules.productores.predios.persistence.PredioRepository;
import cl.quelen.backend.modules.productores.predios.web.CrearPredioRequest;
import cl.quelen.backend.modules.productores.predios.web.PredioResponse;
import org.springframework.stereotype.Service;

@Service
public class PredioService {

    private final PredioRepository repo;
    private final ComunaCsvDictionary comunas;

    public PredioService(PredioRepository repo, ComunaCsvDictionary comunas) {
        this.repo = repo;
        this.comunas = comunas;
    }

    public PredioResponse crear(CrearPredioRequest req) {
        // buscar datos de comuna
        Entry geo = comunas.find(req.codCom);
        if (geo == null) {
            throw new IllegalArgumentException("Comuna no encontrada: " + req.codCom);
        }

        // persistir en repo
        repo.insertarPredio(req, geo);

        return new PredioResponse(true, req.codPre, "Predio creado correctamente");
    }
}
