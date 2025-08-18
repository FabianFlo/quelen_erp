package cl.quelen.backend.modules.productores.adapters.out.jdbc;

import cl.quelen.backend.modules.productores.domain.model.Productor;
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
    public void guardar(Productor p) {
        // Insert SOLO con los campos obligatorios y los que traemos resueltos.
        // Los NOT NULL sin valor los dejamos con default (0/GETDATE()) dentro del SQL.
        final String sql =
            "INSERT INTO dbo.PRODUCTORES (" +
            "  COD_EMP, COD_TEM, COD_PRO, NOM_PRO, " +
            "  RUT_PRO, DV, DIR_PRO, " +
            "  CIU_PRO, PRV_PRO, " +
            "  ZON, DIAS_LIQ_INT, SW_ESTAND_MAT, TOT_INT, SW_REMU, " +
            "  COD_COM, COD_PROVC, GGN, " +
            "  FEC_INI_CBR_INT, FEC_INTERES " +
            ") VALUES (" +
            "  ?, ?, ?, ?, " +                   // COD_EMP, COD_TEM, COD_PRO, NOM_PRO
            "  ?, ?, ?, " +                      // RUT_PRO, DV, DIR_PRO
            "  ?, ?, " +                         // CIU_PRO, PRV_PRO
            "  ?, 0, 0, 0.0, 0, " +              // ZON, DIAS_LIQ_INT, SW_ESTAND_MAT, TOT_INT, SW_REMU
            "  ?, ?, ?, " +                      // COD_COM, COD_PROVC, GGN
            "  GETDATE(), GETDATE()" +           // FEC_INI_CBR_INT, FEC_INTERES
            ")";

        jdbc.update(sql,
            p.codEmp,
            p.codTem,
            p.codPro,
            p.nomPro,
            p.rutPro == null ? 0 : p.rutPro,
            safe(p.dv),
            safe(p.dirPro),
            safe(p.ciuPro),
            safe(p.prvPro),
            p.zon,
            safe(p.codCom),
            safe(p.codProvc),
            safe(p.ggn)
        );
    }

    private static String safe(String s) { return s == null ? "" : s; }
}
