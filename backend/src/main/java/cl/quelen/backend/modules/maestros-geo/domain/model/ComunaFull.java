package cl.quelen.backend.modules.maestrosgeo.domain.model;

public class ComunaFull {
    private final String comunaCodigo;     // ej. "13302"
    private final String comunaNombre;     // ej. "PAINE"
    private final String provinciaCodigo;  // ej. "133"
    private final String provinciaNombre;  // ej. "MAIPO"
    private final String regionCodigo;     // ej. "13"
    private final String regionNombre;     // ej. "METROPOLITANA"

    public ComunaFull(String comunaCodigo, String comunaNombre,
                      String provinciaCodigo, String provinciaNombre,
                      String regionCodigo, String regionNombre) {
        this.comunaCodigo = comunaCodigo;
        this.comunaNombre = comunaNombre;
        this.provinciaCodigo = provinciaCodigo;
        this.provinciaNombre = provinciaNombre;
        this.regionCodigo = regionCodigo;
        this.regionNombre = regionNombre;
    }

    public String getComunaCodigo() { return comunaCodigo; }
    public String getComunaNombre() { return comunaNombre; }
    public String getProvinciaCodigo() { return provinciaCodigo; }
    public String getProvinciaNombre() { return provinciaNombre; }
    public String getRegionCodigo() { return regionCodigo; }
    public String getRegionNombre() { return regionNombre; }
}
