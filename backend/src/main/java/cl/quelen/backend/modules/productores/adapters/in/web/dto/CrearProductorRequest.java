package cl.quelen.backend.modules.productores.adapters.in.web.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    // NUEVO: responsable (usuario del sidebar)
    @JsonAlias({ "creadoPor", "responsable", "usuario" })
    public String creadoPor;   // -> RESPONSABLE_PROD
    
    public String expCodigo;
}
