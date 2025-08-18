package cl.quelen.backend.modules.maestrosgeo.domain.port.in;

import cl.quelen.backend.modules.maestrosgeo.domain.model.Comuna;
import java.util.List;

public interface ListarComunasPorTem {
    List<Comuna> handle(String codTem);
}
