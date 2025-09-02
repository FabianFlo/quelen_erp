package cl.quelen.backend.modules.productores.exportador.persistence;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * Inserta en dbo.PRODUCTOR_X_EXPORTADOR.
 * SQL nativo simple, sin tablas nuevas.
 */
@Repository
public class ProductorExportadorRepository {

    private final JdbcTemplate jdbc;

    public ProductorExportadorRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final String SQL_INSERT =
        "INSERT INTO dbo.PRODUCTOR_X_EXPORTADOR (" +
        "  COD_PRO, COD_EXP, COD_TEM, COD_EMP, PORC" +
        ") VALUES (?,?,?,?,?)";

    /**
     * Vincula un productor con un exportador.
     * @param codPro nvarchar(16) NOT NULL
     * @param codExp nvarchar(4)  NOT NULL
     * @param codTem nvarchar(2)  NOT NULL
     * @param codEmp nvarchar(4)  NOT NULL
     * @param porc   int NOT NULL
     */
    public void vincular(String codPro, String codExp, String codTem, String codEmp, Integer porc) {
        try {
            jdbc.update(SQL_INSERT,
                safe(codPro),
                safe(codExp),
                safe(codTem),
                safe(codEmp),
                porc == null ? 0 : porc
            );
        } catch (DuplicateKeyException e) {
            // Si la PK/UK evita duplicados en la tabla puente
            throw new RuntimeException("Ya existe el vínculo productor-exportador para " + codPro + " / " + codExp + ".");
        } catch (DataIntegrityViolationException e) {
            // FK violada (productor o exportador inexistente, o temporada/empresa no coinciden)
            String detail = (e.getMostSpecificCause() != null ? e.getMostSpecificCause().getMessage() : e.getMessage());
            throw new RuntimeException("No se pudo vincular exportador. " + (detail != null ? detail : ""));
        } catch (Exception e) {
            throw new RuntimeException("Error al vincular exportador: " + e.getMessage(), e);
        }
    }

    private static String safe(String s) { return s == null ? "" : s.trim(); }
}
