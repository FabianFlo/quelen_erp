package cl.quelen.backend.modules.maestrosgeo.adapters.out.jdbc;

import cl.quelen.backend.modules.maestrosgeo.domain.model.Comuna;
import cl.quelen.backend.modules.maestrosgeo.domain.port.out.ComunaQueryPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ComunaJdbcAdapter implements ComunaQueryPort {

    private final JdbcTemplate jdbcTemplate;

    public ComunaJdbcAdapter(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Comuna> listarPorTem(String codTem) {
        final String sql =
            "SELECT COD_COM, DESCRIPCION " +
            "FROM COMUNAS " +
            "WHERE COD_TEM = ? " +
            "ORDER BY DESCRIPCION";

        return jdbcTemplate.query(
            sql,
            ps -> ps.setString(1, codTem),
            (rs, i) -> new Comuna(
                rs.getString("COD_COM") == null ? "" : rs.getString("COD_COM").trim(),
                rs.getString("DESCRIPCION") == null ? "" : rs.getString("DESCRIPCION").trim()
            )
        );
    }
}
