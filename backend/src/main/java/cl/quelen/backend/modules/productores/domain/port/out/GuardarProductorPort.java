package cl.quelen.backend.modules.productores.domain.port.out;

import cl.quelen.backend.modules.productores.domain.model.Productor;

public interface GuardarProductorPort {
    void guardar(Productor p);
}
