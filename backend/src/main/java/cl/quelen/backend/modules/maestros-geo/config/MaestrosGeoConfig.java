package cl.quelen.backend.modules.maestrosgeo.config;

import cl.quelen.backend.modules.maestrosgeo.application.usecase.ListarComunasPorTemService;
import cl.quelen.backend.modules.maestrosgeo.domain.port.in.ListarComunasPorTem;
import cl.quelen.backend.modules.maestrosgeo.domain.port.out.ComunaQueryPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MaestrosGeoConfig {

    @Bean
    public ListarComunasPorTem listarComunasPorTem(ComunaQueryPort comunaQueryPort) {
        return new ListarComunasPorTemService(comunaQueryPort);
    }
}
