package cl.quelen.backend.modules.productores.persistence;

import cl.quelen.backend.modules.productores.web.OpcionResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProductorLookupRepository {

    private final JdbcTemplate jdbc;

    public ProductorLookupRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<OpcionResponse> listarProductoresPorTemporada(String codTem) {
        String sql = """
            SELECT 
              p.COD_PRO    AS codigo,
              p.NOM_PRO_CRT AS descripcion
            FROM PRODUCTORES p
            WHERE p.COD_TEM = ?
            ORDER BY p.COD_PRO ASC
            """;
        return jdbc.query(sql, (rs, rowNum) ->
            new OpcionResponse(
                rs.getString("codigo"),
                rs.getString("descripcion")
            ), codTem);
    }

    public List<OpcionResponse> listarPrediosPorProductor(String codTem, String codPro) {
        String sql = """
            SELECT 
              p.COD_PRE    AS codigo,
              p.DESCRIPCION AS descripcion
            FROM PREDIOS p
            WHERE p.COD_TEM = ? AND p.COD_PRO = ?
            ORDER BY p.DESCRIPCION ASC
            """;
        return jdbc.query(sql, (rs, rowNum) ->
            new OpcionResponse(
                rs.getString("codigo"),
                rs.getString("descripcion")
            ), codTem, codPro);
    }
}
