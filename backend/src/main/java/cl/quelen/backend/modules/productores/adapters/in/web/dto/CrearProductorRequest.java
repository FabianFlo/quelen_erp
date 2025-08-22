package cl.quelen.backend.modules.productores.adapters.in.web.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CrearProductorRequest {
    // obligatorios
    public String codEmp;      // ej. "MER"
    public String codTem;      // ej. "7"
    public String codPro;      // ej. "A5001"
    public String nomPro;      // ej. "AGRICOLA LA CARRERA LTDA"
    public String zon;         // ej. "C"

    // opcionales / otros
    public Integer rutPro;     // 77128700
    public String dv;          // "K"
    public String dirPro;      // "FUNDO ..."
    public String ggn;         // "40499..."

    // comuna por código o nombre (uno de los dos)
    public String comunaCodigo; // "13302"
    public String comunaNombre; // "PAINE"

    // CIU_PRO: lo que mande el front. Aceptamos varios alias para asegurar mapeo.
    @JsonAlias({ "ciudad", "cuidad", "ciuPro", "ciudadNombre", "city" })
    public String ciudad;      // se truncará a 15 al persistir
}
