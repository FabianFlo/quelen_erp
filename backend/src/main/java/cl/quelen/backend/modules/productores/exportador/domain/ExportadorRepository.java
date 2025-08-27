package cl.quelen.erp.productores.exportador.domain;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

/** Acceso directo con SQL nativo, sin entidades ni tablas nuevas. */
@Repository
public class ExportadorRepository {

    private final JdbcTemplate jdbc;

    public ExportadorRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final String SQL_LISTAR =
        "SELECT COD_EXP, NOM_EXP " +
        "FROM EXPORTADORES " +
        "WHERE COD_TEM = ? " +
        "ORDER BY COD_EXP";

    public List<ExportadorRef> findByTemporada(int codTem) {
        return jdbc.query(
            SQL_LISTAR,
            ps -> ps.setInt(1, codTem),
            (rs, i) -> new ExportadorRef(
                rs.getInt("COD_EXP"),
                rs.getString("NOM_EXP")
            )
        );
    }
}
