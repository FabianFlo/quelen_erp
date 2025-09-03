package cl.quelen.backend.modules.productores.predios.web;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CrearPredioRequest {
    public String codEmp;
    public String codTem;
    public String codPro;
    public String codPre;
    public String descripcion;
    public String direccion;
    public String zon;
    public String codCom;   // código de la comuna
    public String ggn;
}
