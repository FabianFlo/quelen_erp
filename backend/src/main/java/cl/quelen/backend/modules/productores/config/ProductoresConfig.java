package cl.quelen.backend.modules.productores.config;

import cl.quelen.backend.modules.maestrosgeo.domain.port.in.ResolveComuna;
import cl.quelen.backend.modules.productores.application.usecase.CrearProductorService;
import cl.quelen.backend.modules.productores.domain.port.in.CrearProductor;
import cl.quelen.backend.modules.productores.domain.port.out.GuardarProductorPort;
import cl.quelen.backend.modules.productores.domain.port.out.GuardarProductorExportadorPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProductoresConfig {

    @Bean
    public CrearProductor crearProductor(GuardarProductorPort guardarPort,
                                         GuardarProductorExportadorPort guardarProdExpPort,
                                         ResolveComuna resolveComuna) {
        return new CrearProductorService(guardarPort, guardarProdExpPort, resolveComuna);
    }
}
