package cl.quelen.backend.modules.productores.domain.port.out;

public interface GuardarProductorExportadorPort {

    void guardar(String codEmp, String codTem, String codPro, String codExp, int porc);

}
