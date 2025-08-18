package cl.quelen.backend.modules.maestrosgeo.domain.port.out;

import cl.quelen.backend.modules.maestrosgeo.domain.model.ComunaFull;

public interface ComunaDictionary {
    ComunaFull findByCodigo(String codigo); // null si no existe
    ComunaFull findByNombre(String nombreNormalizado); // null si no existe
}
