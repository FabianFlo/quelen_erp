package cl.quelen.backend.modules.maestrosgeo.config;

import cl.quelen.backend.modules.maestrosgeo.application.usecase.ListarComunasPorTemService;
import cl.quelen.backend.modules.maestrosgeo.domain.port.in.ListarComunasPorTem;
import cl.quelen.backend.modules.maestrosgeo.domain.port.out.ComunaQueryPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MaestrosGeoListarConfig {

    // Aunque @Service ya existe, definimos @Bean explícito para garantizar el bean
    @Bean
    public ListarComunasPorTem listarComunasPorTem(ComunaQueryPort queryPort) {
        return new ListarComunasPorTemService(queryPort);
    }
}
