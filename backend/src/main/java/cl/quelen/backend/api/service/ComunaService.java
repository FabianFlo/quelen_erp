// src/main/java/cl/quelen/backend/services/ComunaService.java
package cl.quelen.backend.services;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ComunaService {

    private final JdbcTemplate jdbcTemplate;

    public ComunaService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<String> listarComunasPorTem(String codTem) {
        final String sql =
            "SELECT COD_COM, DESCRIPCION " +
            "FROM COMUNAS " +
            "WHERE COD_TEM = ? " +
            "ORDER BY DESCRIPCION";

        return jdbcTemplate.query(
            sql,
            ps -> ps.setString(1, codTem),
            (rs, i) -> {
                String cod = rs.getString("COD_COM");
                String desc = rs.getString("DESCRIPCION");
                cod = cod == null ? "" : cod.trim();
                desc = desc == null ? "" : desc.trim();
                return cod + " - " + desc;
            }
        );
    }
}
