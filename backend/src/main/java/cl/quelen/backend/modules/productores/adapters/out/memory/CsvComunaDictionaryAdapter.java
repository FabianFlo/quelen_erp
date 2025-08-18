package cl.quelen.backend.modules.maestrosgeo.adapters.out.memory;

import cl.quelen.backend.modules.maestrosgeo.domain.model.ComunaFull;
import cl.quelen.backend.modules.maestrosgeo.domain.port.out.ComunaDictionary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class CsvComunaDictionaryAdapter implements ComunaDictionary {

    private final ResourceLoader resourceLoader;

    // Por defecto leemos desde classpath; puedes sobreescribir con una ruta absoluta:
    // application.properties: geo.dictionary.path=file:/opt/data/comunas.csv
    @Value("${geo.dictionary.path:classpath:geo/comunas.csv}")
    private String csvPath;

    private final Map<String, ComunaFull> byCode = new HashMap<>();
    private final Map<String, ComunaFull> byName = new HashMap<>();

    public CsvComunaDictionaryAdapter(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @PostConstruct
    public void load() {
        try {
            Resource res = resourceLoader.getResource(csvPath);
            if (!res.exists()) throw new IllegalStateException("No se encuentra CSV en " + csvPath);

            try (BufferedReader br = new BufferedReader(new InputStreamReader(res.getInputStream(), StandardCharsets.UTF_8))) {
                String header = br.readLine(); // primera línea (encabezados)
                if (header == null) throw new IllegalStateException("CSV vacío: " + csvPath);

                // índices por nombre de columna (tolerante con espacios)
                String[] cols = header.split(",", -1);
                Map<String,Integer> idx = new HashMap<>();
                for (int i = 0; i < cols.length; i++) {
                    idx.put(cols[i].trim().toLowerCase(), i);
                }

                int iNomCom   = require(idx, "nombre comuna");
                int iCodCom   = require(idx, "código comuna desde 2018");
                int iNomProv  = require(idx, "provincia desde 2018");
                int iCodProv  = require(idx, "código provincia desde 2018");
                int iNomReg   = require(idx, "nombre región desde 2018");
                int iCodReg   = require(idx, "código región desde 2018");

                byCode.clear();
                byName.clear();

                for (String line; (line = br.readLine()) != null; ) {
                    // soporta comas en textos si no hay comillas; si tu CSV pudiera tener comas en nombres,
                    // conviene exportar con ; como separador. Para ahora asumimos simple split por coma.
                    String[] f = line.split(",", -1);
                    // Si la línea no trae todas las columnas, la ignoramos
                    if (f.length <= Math.max(Math.max(iNomCom,iCodCom), Math.max(Math.max(iNomProv,iCodProv), Math.max(iNomReg,iCodReg)))) {
                        continue;
                    }
                    String nomCom = safe(f[iNomCom]).toUpperCase();
                    String codCom = safe(f[iCodCom]);
                    String nomProv = safe(f[iNomProv]).toUpperCase();
                    String codProv = safe(f[iCodProv]);
                    String nomReg = safe(f[iNomReg]).toUpperCase();
                    String codReg = safe(f[iCodReg]);

                    if (codCom.isEmpty() || nomCom.isEmpty()) continue;

                    ComunaFull cf = new ComunaFull(codCom, nomCom, codProv, nomProv, codReg, nomReg);
                    byCode.put(codCom, cf);
                    byName.put(normalize(nomCom), cf);
                }
            }
        } catch (Exception ex) {
            throw new RuntimeException("Error cargando diccionario de comunas desde " + csvPath + ": " +
                    ex.getClass().getSimpleName() + " - " + ex.getMessage(), ex);
        }
    }

    private static int require(Map<String,Integer> idx, String nameLower) {
        Integer i = idx.get(nameLower);
        if (i == null) throw new IllegalStateException("No se encontró columna: " + nameLower);
        return i;
    }

    private static String safe(String s) {
        return s == null ? "" : s.trim();
    }

    private static String normalize(String s) {
        String t = s == null ? "" : s.trim().toLowerCase();
        t = Normalizer.normalize(t, Normalizer.Form.NFD).replaceAll("\\p{M}+", "");
        t = t.replaceAll("\\s+", " ");
        return t;
    }

    @Override
    public ComunaFull findByCodigo(String codigo) {
        if (codigo == null) return null;
        return byCode.get(codigo.trim());
    }

    @Override
    public ComunaFull findByNombre(String nombreNormalizado) {
        if (nombreNormalizado == null) return null;
        return byName.get(nombreNormalizado.trim());
    }
}
