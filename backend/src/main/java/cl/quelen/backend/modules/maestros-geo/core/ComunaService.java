package cl.quelen.backend.modules.maestrosgeo.core;

import cl.quelen.backend.modules.maestrosgeo.persistence.ComunaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComunaService {

    private final ComunaRepository repo;

    public ComunaService(ComunaRepository repo) {
        this.repo = repo;
    }

    public List<Comuna> listarCodigoDescripcionPorTem(String codTem) {
        if (codTem == null || codTem.trim().isEmpty()) {
            throw new IllegalArgumentException("codTem es requerido");
        }
        return repo.listarCodigoDescripcionPorTem(codTem.trim());
    }
}
