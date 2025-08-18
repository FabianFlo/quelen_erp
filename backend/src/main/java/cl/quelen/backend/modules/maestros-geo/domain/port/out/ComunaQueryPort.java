package cl.quelen.backend.modules.maestrosgeo.domain.port.out;

import cl.quelen.backend.modules.maestrosgeo.domain.model.Comuna;
import java.util.List;

public interface ComunaQueryPort {
    List<Comuna> listarPorTem(String codTem);
}
