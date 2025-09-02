package cl.quelen.backend.modules.productores.core;

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.*;

/**
 * Diccionario de comunas basado en CSV (resources/geo/comunas.csv).
 *
 * Espera cabecera con nombres similares a:
 *  - "Código Comuna desde 2018"
 *  - "Código Provincia desde 2018"
 *  - "Código Región desde 2018"
 *
 * Soporta separador ',' o ';'. Detecta columnas por "palabras clave" (case-insensitive y sin acentos):
 *  - CODIGO + COMUNA   -> código de comuna
 *  - CODIGO + PROVINCIA-> código de provincia
 *  - CODIGO + REGION   -> código de región
 *
 * Guarda todo como String (sin padding) para calzar con tus códigos en BD.
 */
@Component
public class ComunaCsvDictionary {

    public static final class Entry {
        public final String codCom;     // código comuna (ej. "1344")
        public final String provincia;  // código provincia (ej. "134")
        public final String region;     // código región (ej. "13")
        public final String nombre;     // nombre comuna (opcional)

        public Entry(String codCom, String provincia, String region, String nombre) {
            this.codCom = codCom;
            this.provincia = provincia;
            this.region = region;
            this.nombre = nombre;
        }
    }

    private final Map<String, Entry> byCodigo = new HashMap<>();

    @PostConstruct
    public void load() {
        try {
            ClassPathResource res = new ClassPathResource("geo/comunas.csv");
            if (!res.exists()) {
                throw new IllegalStateException("No se encontró resources/geo/comunas.csv en el classpath.");
            }

            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(res.getInputStream(), StandardCharsets.UTF_8))) {

                String headerLine = br.readLine();
                if (headerLine == null) return;

                char sep = headerLine.indexOf(';') >= 0 ? ';' : ',';
                String[] header = split(headerLine, sep);

                // detectar columnas por palabras clave
                int idxCodCom = findIndex(header, "codigo", "comuna");
                int idxCodProv = findIndex(header, "codigo", "provincia");
                int idxCodReg = findIndex(header, "codigo", "region");
                int idxNombre = findIndex(header, "nombre", "comuna"); // opcional

                if (idxCodCom < 0 || idxCodProv < 0 || idxCodReg < 0) {
                    throw new IllegalStateException("Cabecera CSV no contiene columnas esperadas (codigo comuna/provincia/region).");
                }

                String line;
                while ((line = br.readLine()) != null) {
                    if (line.trim().isEmpty()) continue;
                    String[] row = split(line, sep);

                    String codCom  = get(row, idxCodCom);
                    String codProv = get(row, idxCodProv);
                    String codReg  = get(row, idxCodReg);
                    String nombre  = idxNombre >= 0 ? get(row, idxNombre) : null;

                    if (isBlank(codCom)) continue;
                    // normalizamos a trim
                    codCom = codCom.trim();
                    codProv = codProv == null ? null : codProv.trim();
                    codReg  = codReg  == null ? null : codReg.trim();

                    byCodigo.put(codCom, new Entry(codCom, codProv, codReg, nombre));
                }
            }
        } catch (Exception e) {
            throw new IllegalStateException("Error cargando comunas.csv: " + e.getMessage(), e);
        }
    }

    /** Busca una comuna por código. Devuelve null si no existe. */
    public Entry find(String codCom) {
        if (codCom == null) return null;
        return byCodigo.get(codCom.trim());
    }

    // -------- helpers --------

    private static String[] split(String line, char sep) {
        // Split simple (si tu CSV no trae comillas ni separadores embebidos)
        return line.split("\\" + sep, -1);
    }

    private static int findIndex(String[] header, String... keywords) {
        for (int i = 0; i < header.length; i++) {
            String norm = normalize(header[i]);
            boolean ok = true;
            for (String kw : keywords) {
                if (!norm.contains(normalize(kw))) {
                    ok = false; break;
                }
            }
            if (ok) return i;
        }
        return -1;
    }

    private static String normalize(String s) {
        if (s == null) return "";
        String n = Normalizer.normalize(s, Normalizer.Form.NFD).replaceAll("\\p{M}+", "");
        return n.toLowerCase(Locale.ROOT).replace(" ", "");
    }

    private static String get(String[] row, int i) {
        if (i < 0 || i >= row.length) return null;
        String v = row[i];
        return v == null ? null : v.trim();
    }

    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
}
