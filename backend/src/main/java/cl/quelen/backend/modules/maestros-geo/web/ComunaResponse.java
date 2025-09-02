package cl.quelen.backend.modules.maestrosgeo.web;

import cl.quelen.backend.modules.maestrosgeo.core.Comuna;

public class ComunaResponse {
    private String codigo;
    private String descripcion;

    public ComunaResponse() { }

    public ComunaResponse(Comuna c) {
        this.codigo = c.getCodigo();
        this.descripcion = c.getDescripcion();
    }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
