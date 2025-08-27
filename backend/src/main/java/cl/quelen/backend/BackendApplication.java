package cl.quelen.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
    scanBasePackages = {
        "cl.quelen.backend", // tu app principal y módulos existentes
        "cl.quelen.erp"      // incluye controllers/adapters que están bajo cl.quelen.erp...
    }
)
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
