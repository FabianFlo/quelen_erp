package cl.quelen.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class LoginService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final List<String> adminUsers = Arrays.asList("otobar", "spozo", "fflores");
    private final List<String> patioUsers = Arrays.asList("jverdejo", "srivas");
    private final List<String> normalUsers = Arrays.asList("user1", "user2");

    public String login(String userId, String password) {
        String sql = "SELECT name, CONVERT(INT, PWDCOMPARE(?, CONVERT(varbinary(255), LOGINPROPERTY(name, 'PasswordHash')))) AS resu " +
                     "FROM sys.syslogins WHERE name = ?";

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, password, userId);

        if (result.isEmpty()) {
            return "ERROR: Usuario no encontrado";
        }

        Map<String, Object> row = result.get(0);
        int match = (int) row.get("resu");

        if (match == 1) {
            String username = ((String) row.get("name")).toLowerCase();

            if (adminUsers.contains(username)) {
                return "A"; // Administrador
            } else if (patioUsers.contains(username)) {
                return "P"; // Patio
            } else if (normalUsers.contains(username)) {
                return "U"; // Usuario
            } else {
                return "U"; // Por defecto
            }
        }

        return "ERROR: Contraseña incorrecta";
    }
}
