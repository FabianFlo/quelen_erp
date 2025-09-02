package cl.quelen.backend.modules.auth.persistence;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Verificación de credenciales contra sys.syslogins usando PWDCOMPARE.
 * Devuelve el nombre del login normalizado (lowercase) si coincide; si no, null.
 */
@Repository
public class CredentialsRepository {

    private final JdbcTemplate jdbc;

    public CredentialsRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public String verify(String userId, String password) {
        // MISMA consulta que usabas:
        String sql =
            "SELECT name, CONVERT(INT, PWDCOMPARE(?, CONVERT(varbinary(255), LOGINPROPERTY(name, 'PasswordHash')))) AS resu " +
            "FROM sys.syslogins WHERE name = ?";

        List<Map<String,Object>> rows = jdbc.queryForList(sql, password, userId);
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
