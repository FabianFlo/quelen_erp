package cl.quelen.backend.modules.maestrosgeo.config;

import cl.quelen.backend.modules.maestrosgeo.application.usecase.ResolveComunaService;
import cl.quelen.backend.modules.maestrosgeo.domain.port.in.ResolveComuna;
import cl.quelen.backend.modules.maestrosgeo.domain.port.out.ComunaDictionary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MaestrosGeoConfig {

    @Bean
    public ResolveComuna resolveComuna(ComunaDictionary dict) {
        return new ResolveComunaService(dict);
    }
}
