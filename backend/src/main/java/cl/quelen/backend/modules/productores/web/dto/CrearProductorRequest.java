package cl.quelen.backend.modules.productores.web.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CrearProductorRequest {
    // obligatorios
    public String codEmp;
    public String codTem;
    public String codPro;
    public String nomPro;
    public String zon;

    // opcionales / otros
    public Integer rutPro;
    public String dv;
    public String dirPro;
    public String ggn;

    // comuna por código o nombre (uno de los dos)
    public String comunaCodigo;
    public String comunaNombre;

    @JsonAlias({ "ciudad", "cuidad", "ciuPro", "ciudadNombre", "city" })
    public String ciudad;

    // === Exportadores ===
    // Compatibilidad con payload antiguo (un solo exportador):
    public String expCodigo;

    @JsonAlias({ "porc", "porcentaje" })
    public Integer porc;

    // Nuevo: múltiples exportadores
    public List<ExportadorItem> exportadores;

    @JsonAlias({ "creadoPor", "responsable", "usuario" })
    public String creadoPor;

    public String expCodigoOldAlias; // compat si algún front raro lo envía
    public String expCodigo2;        // idem
    public String expCodigo3;        // idem
    public String expCodigo4;        // idem

    // DTO interno para lista de exportadores
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ExportadorItem {
        public String expCodigo;

        @JsonAlias({ "porc", "porcentaje" })
        public Integer porc;
    }
}
