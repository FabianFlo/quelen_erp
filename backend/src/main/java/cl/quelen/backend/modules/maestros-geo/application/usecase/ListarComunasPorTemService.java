package cl.quelen.backend.modules.maestrosgeo.application.usecase;

import cl.quelen.backend.modules.maestrosgeo.domain.model.Comuna;
import cl.quelen.backend.modules.maestrosgeo.domain.port.in.ListarComunasPorTem;
import cl.quelen.backend.modules.maestrosgeo.domain.port.out.ComunaQueryPort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ListarComunasPorTemService implements ListarComunasPorTem {

    private final ComunaQueryPort queryPort;

    public ListarComunasPorTemService(ComunaQueryPort queryPort) {
        this.queryPort = Objects.requireNonNull(queryPort);
    }

    @Override
    public List<Comuna> handle(String codTem) {
        if (codTem == null || codTem.trim().isEmpty()) {
            throw new IllegalArgumentException("codTem es requerido");
        }
        return queryPort.listarPorTem(codTem.trim());
    }
}
