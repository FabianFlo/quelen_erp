// src/main/java/cl/quelen/backend/services/ProvinciaService.java
package cl.quelen.backend.services;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProvinciaService {

    private final JdbcTemplate jdbcTemplate;

    public ProvinciaService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<String> listarProvinciasPorTem(String codTem) {
        final String sql =
            "SELECT COD_PROVC, DESCRIPCION " +
            "FROM PROVINCIAS " +
            "WHERE COD_TEM = ? " +
            "ORDER BY DESCRIPCION";

        return jdbcTemplate.query(
            sql,
            ps -> ps.setString(1, codTem),
            (rs, i) -> {
                String cod = rs.getString("COD_PROVC");
                String desc = rs.getString("DESCRIPCION");
                cod = cod == null ? "" : cod.trim();
                desc = desc == null ? "" : desc.trim();
                return cod + " - " + desc;
            }
        );
    }
}
