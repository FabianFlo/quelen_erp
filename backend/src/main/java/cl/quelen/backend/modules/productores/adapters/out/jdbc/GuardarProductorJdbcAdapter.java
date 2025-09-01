package cl.quelen.backend.modules.productores.adapters.out.jdbc;

import cl.quelen.backend.modules.productores.domain.port.out.GuardarProductorPort;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class GuardarProductorJdbcAdapter implements GuardarProductorPort {

    private final JdbcTemplate jdbc;

    public GuardarProductorJdbcAdapter(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
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
            jdbc.update(sql,
                p.codEmp,
                p.codTem,
                p.codPro,
                safe(p.nomPro),
                safe(p.nomProCrt),

                p.rutPro == null ? 0 : p.rutPro,
                safe(p.dv),
                safe(p.dirPro),

                safe(p.ciuPro),
                safe(p.prvPro),
                safe(p.nivPro),

                p.zon,
                p.swInactivo ? 1 : 0,

                safe(p.codCom),
                safe(p.codProvc),
                safe(p.ggn),
                safe(p.fax),

                safe(p.responsableProd)
            );
        } catch (DuplicateKeyException e) {
            throw new RuntimeException("Ya existe el código: " + p.codPro);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Datos inválidos o incompletos.");
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar productor: " + e.getMessage(), e);
        }
    }

    private static String safe(String s) { return s == null ? "" : s.trim(); }
}
