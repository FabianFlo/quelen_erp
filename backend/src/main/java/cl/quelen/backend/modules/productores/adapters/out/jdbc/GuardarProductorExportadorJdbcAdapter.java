package cl.quelen.backend.modules.productores.adapters.out.jdbc;

import cl.quelen.backend.modules.productores.domain.port.out.GuardarProductorExportadorPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class GuardarProductorExportadorJdbcAdapter implements GuardarProductorExportadorPort {

    private final JdbcTemplate jdbc;

    public GuardarProductorExportadorJdbcAdapter(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void guardar(String codEmp, String codTem, String codPro, String codExp, int porc) {
        final String sql = "INSERT INTO PRODUCTOR_X_EXPORTADOR " +
                "(COD_PRO, COD_EXP, COD_TEM, COD_EMP, PORC) VALUES (?, ?, ?, ?, ?)";
        jdbc.update(sql, codPro, codExp, codTem, codEmp, porc);
    }
}
