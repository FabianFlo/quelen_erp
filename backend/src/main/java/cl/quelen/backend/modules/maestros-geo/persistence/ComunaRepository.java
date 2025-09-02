package cl.quelen.backend.modules.maestrosgeo.persistence;

import cl.quelen.backend.modules.maestrosgeo.core.Comuna;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class ComunaRepository {

    private final JdbcTemplate jdbc;

    public ComunaRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // Opción A) COMUNA tiene columna de temporada COD_TEM
    private static final String SQL_LISTAR_POR_TEM = """
        SELECT 
            c.COD_COM    AS codigo,
            c.DESCRIPCION AS descripcion
        FROM COMUNAS c
        WHERE c.COD_TEM = ?
        ORDER BY c.DESCRIPCION ASC
        """;

    private static final RowMapper<Comuna> MAPPER = new RowMapper<Comuna>() {
        @Override
        public Comuna mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Comuna(
                rs.getString("codigo"),
                rs.getString("descripcion")
            );
        }
    };

    public List<Comuna> listarCodigoDescripcionPorTem(String codTem) {
        return jdbc.query(SQL_LISTAR_POR_TEM, MAPPER, codTem);
    }
}
