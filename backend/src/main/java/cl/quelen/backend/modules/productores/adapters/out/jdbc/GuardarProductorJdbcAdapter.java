package cl.quelen.backend.modules.productores.adapters.out.jdbc;

import cl.quelen.backend.modules.productores.domain.port.out.GuardarProductorPort;
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
            "  ?, ?, ?, ?, ?, " +                   // COD_EMP, COD_TEM, COD_PRO, NOM_PRO, NOM_PRO_CRT
            "  ?, ?, ?, " +                         // RUT_PRO, DV, DIR_PRO
            "  ?, ?, ?, " +                         // CIU_PRO, PRV_PRO, NIV_PRO
            "  ?, 0, 0, 0.0, 0, ?, " +              // ZON, ..., SW_INACTIVO
            "  ?, ?, ?, ?, " +                      // COD_COM, COD_PROVC, GGN, FAX
            "  NULL, NULL, " +                      // fechas NULL
            "  ?" +                                 // RESPONSABLE_PROD
            ")";

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

            safe(p.responsableProd)   // <<<<< NUEVO VALOR
        );
    }

    private static String safe(String s) { return s == null ? "" : s.trim(); }
}
