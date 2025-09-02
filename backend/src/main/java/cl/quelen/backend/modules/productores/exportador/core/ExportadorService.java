package cl.quelen.backend.modules.productores.exportador.core;

import cl.quelen.backend.modules.productores.exportador.persistence.ExportadorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExportadorService {

    private final ExportadorRepository repo;

    public ExportadorService(ExportadorRepository repo) {
        this.repo = repo;
    }

    /** Devuelve "COD_EXP - NOM_EXP" (misma lógica que tenías). */
    public List<String> listarPorTemporada(int codTem) {
        return repo.findByTemporada(codTem)
                   .stream()
                   .map(e -> e.getCodExp() + " - " + e.getNomExp())
                   .collect(Collectors.toList());
    }
}
