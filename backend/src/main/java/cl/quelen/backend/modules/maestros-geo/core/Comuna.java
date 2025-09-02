package cl.quelen.backend.modules.maestrosgeo.core;

public class Comuna {
    private String codigo;       // ej: "13101"
    private String descripcion;  // ej: "Santiago"

    public Comuna() { }

    public Comuna(String codigo, String descripcion) {
        this.codigo = codigo;
        this.descripcion = descripcion;
    }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
