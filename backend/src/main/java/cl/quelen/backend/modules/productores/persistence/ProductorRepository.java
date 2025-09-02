package cl.quelen.backend.modules.productores.persistence;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;

@Repository
public class ProductorRepository {

    private static final Logger log = LoggerFactory.getLogger(ProductorRepository.class);
    private final JdbcTemplate jdbc;

    public ProductorRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /** Chequeo previo por (COD_EMP, COD_TEM, COD_PRO). */
    public boolean existsByEmpTemPro(String codEmp, String codTem, String codPro) {
        final String sql = "SELECT 1 FROM dbo.PRODUCTORES WHERE COD_EMP = ? AND COD_TEM = ? AND COD_PRO = ?";
        SqlRowSet rs = jdbc.queryForRowSet(sql, codEmp, codTem, codPro);
        return rs.next();
    }

    /** Chequea existencia de COMUNA en BD (para evitar caer en FK en el insert). */
    public boolean existsComuna(String codCom) {
        final String sql = "SELECT 1 FROM dbo.COMUNAS WHERE COD_COM = ?";
        SqlRowSet rs = jdbc.queryForRowSet(sql, codCom);
        return rs.next();
    }

    /**
     * MISMO SQL y ORDEN que usabas (sin inventar campos).
     */
    public void guardar(GuardarRequest p) {
        final String sql =
            "INSERT INTO dbo.PRODUCTORES (" +
            "  COD_EMP, COD_TEM, COD_PRO, NOM_PRO, NOM_PRO_CRT, " +
            "  RUT_PRO, DV, DIR_PRO, " +
            "  CIU_PRO, PRV_PRO, NIV_PRO, " +
            "  ZON, DIAS_LIQ_INT, SW_ESTAND_MAT, TOT_INT, SW_REMU, SW_INACTIVO, " +
            "  COD_COM, COD_PROVC, GGN, FAX, " +
            "  FEC_INI_CBR_INT, FEC_INTERES, " +
            "  RESPONSABLE_PROD " +
            ") VALUES (" +
            "  ?, ?, ?, ?, ?, " +
            "  ?, ?, ?, " +
            "  ?, ?, ?, " +
            "  ?, 0, 0, 0.0, 0, ?, " +
            "  ?, ?, ?, ?, " +
            "  NULL, NULL, " +
            "  ?" +
            ")";

        try {
            jdbc.update(conn -> {
                PreparedStatement ps = conn.prepareStatement(sql);
                int i = 1;

                ps.setString(i++, safe(p.codEmp));
                ps.setString(i++, safe(p.codTem));
                ps.setString(i++, safe(p.codPro));
                ps.setString(i++, safe(p.nomPro));
                ps.setString(i++, safe(p.nomProCrt));

                ps.setInt(i++, p.rutPro == null ? 0 : p.rutPro);
                ps.setString(i++, safe(p.dv));
                ps.setString(i++, safe(p.dirPro));

                ps.setString(i++, safe(p.ciuPro));
                ps.setString(i++, safe(p.prvPro));   // PRV_PRO (de CSV)
                ps.setString(i++, safe(p.nivPro));   // NIV_PRO (de CSV)

                ps.setString(i++, safe(p.zon));
                ps.setInt(i++, p.swInactivo ? 1 : 0);

                ps.setString(i++, safe(p.codCom));   // FK COMUNAS
                ps.setString(i++, safe(p.codProvc)); // FK PROVINCIAS
                ps.setString(i++, safe(p.ggn));
                ps.setString(i++, safe(p.fax));

                ps.setString(i++, safe(p.responsableProd));
                return ps;
            });
        } catch (DuplicateKeyException e) {
            throw new RuntimeException("Ya existe el código: " + p.codPro);
        } catch (DataIntegrityViolationException e) {
            String detail = (e.getMostSpecificCause() != null ? e.getMostSpecificCause().getMessage() : e.getMessage());
            log.debug("DataIntegrityViolation al insertar productor {}: {}", p.codPro, detail);
            throw new RuntimeException("Datos inválidos o incompletos. " + (detail != null ? detail : ""));
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar productor: " + e.getMessage(), e);
        }
    }

    private static String safe(String s) { return s == null ? "" : s.trim(); }

    // ====== mismos nombres que tu adapter original ======
    public static class GuardarRequest {
        public String codEmp;
        public String codTem;
        public String codPro;
        public String nomPro;
        public String nomProCrt;
        public Integer rutPro;
        public String dv;
        public String dirPro;
        public String ciuPro;
        public String prvPro;
        public String nivPro;
        public String zon;
        public boolean swInactivo;
        public String codCom;
        public String codProvc;
        public String ggn;
        public String fax;
        public String responsableProd;
    }
}
