package cl.quelen.backend.modules.maestrosgeo.domain.model;

import java.util.Objects;

public class Comuna {
    private final String codigo;      // COD_COM
    private final String descripcion; // DESCRIPCION

    public Comuna(String codigo, String descripcion) {
        this.codigo = Objects.requireNonNull(codigo).trim();
        this.descripcion = Objects.requireNonNull(descripcion).trim();
    }

    public String getCodigo() { return codigo; }
    public String getDescripcion() { return descripcion; }
}
