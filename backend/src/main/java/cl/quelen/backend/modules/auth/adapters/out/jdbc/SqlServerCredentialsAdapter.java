package cl.quelen.backend.modules.auth.adapters.out.jdbc;

import cl.quelen.backend.modules.auth.domain.port.out.CredentialsGateway;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class SqlServerCredentialsAdapter implements CredentialsGateway {

    private final JdbcTemplate jdbcTemplate;

    public SqlServerCredentialsAdapter(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public String verify(String userId, String password) {
        String sql =
            "SELECT name, CONVERT(INT, PWDCOMPARE(?, CONVERT(varbinary(255), LOGINPROPERTY(name, 'PasswordHash')))) AS resu " +
            "FROM sys.syslogins WHERE name = ?";

        List<Map<String,Object>> rows = jdbcTemplate.queryForList(sql, password, userId);

        if (rows.isEmpty()) return null;

        Map<String,Object> row = rows.get(0);
        int match = (row.get("resu") instanceof Number) ? ((Number) row.get("resu")).intValue() : 0;

        if (match == 1) {
            String name = String.valueOf(row.get("name"));
            return name == null ? null : name.toLowerCase();
        }
        return null;
    }
}
