package cl.quelen.backend.modules.productores.predios.persistence;

import cl.quelen.backend.modules.productores.predios.web.CrearPredioRequest;
import cl.quelen.backend.modules.productores.core.ComunaCsvDictionary.Entry;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PredioRepository {

    private final JdbcTemplate jdbc;

    public PredioRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final String SQL_INSERT = """
        INSERT INTO dbo.PREDIOS (
          COD_EMP, COD_TEM, COD_PRO, COD_PRE,
          DESCRIPCION, DIRECCION, TELEFONO,
          COD_GRP_PRE, COD_EMP_CONT, COD_CENTROCOSTO,
          ZON, COD_COM, COD_PROVC, COD_PRO_UNITEC,
          REGION, COD_EMP_GES, COD_CSG, COD_IDG,
          LATITUD, LONGITUD, MOSTRAR_CONTRATO, GGN
        ) VALUES (
          ?, ?, ?, ?,
          ?, ?, '',
          NULL, NULL, NULL,
          NULL, ?, ?, NULL,
          ?, NULL, ?, '',
          NULL, NULL, NULL, NULL
        )
    """;

    public void insertarPredio(CrearPredioRequest r, Entry geo) {
        try {
            jdbc.update(SQL_INSERT,
                r.codEmp,
                r.codTem,
                r.codPro,
                r.codPre,
                safe(r.descripcion),
                safe(r.direccion),
                safe(r.codCom),
                geo.provincia,
                geo.region,
                r.codPre // COD_CSG = COD_PRE
            );
        } catch (DuplicateKeyException e) {
            throw new RuntimeException("El predio ya existe: " + r.codPre);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Datos inválidos o incompletos");
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar predio: " + e.getMessage(), e);
        }
    }

    private static String safe(String s) { return s == null ? "" : s.trim(); }
}
