package br.com.crisismanagement.repositories;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import br.com.crisismanagement.entities.AuditoriaLog;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * DAO (Panache Repository) da auditoria. Concentra todo o acesso a dados
 * dos registros de {@link AuditoriaLog}.
 */
@ApplicationScoped
public class AuditoriaRepository implements PanacheRepository<AuditoriaLog> {

    /**
     * Busca registros aplicando filtros opcionais. Parâmetros nulos ou vazios
     * são ignorados. Resultado ordenado do mais recente para o mais antigo.
     */
    public List<AuditoriaLog> search(String entidade, String acao, String usuario) {
        StringBuilder query = new StringBuilder("1 = 1");
        Map<String, Object> params = new HashMap<>();

        if (entidade != null && !entidade.isBlank()) {
            query.append(" and entidadeAfetada = :entidade");
            params.put("entidade", entidade);
        }
        if (acao != null && !acao.isBlank()) {
            query.append(" and acao = :acao");
            params.put("acao", acao);
        }
        if (usuario != null && !usuario.isBlank()) {
            query.append(" and lower(usuarioNome) like :usuario");
            params.put("usuario", "%" + usuario.toLowerCase() + "%");
        }
        query.append(" order by dataHora desc");

        return find(query.toString(), params).list();
    }

    public List<String> distinctEntidades() {
        return getEntityManager()
                .createQuery("select distinct a.entidadeAfetada from AuditoriaLog a order by a.entidadeAfetada",
                        String.class)
                .getResultList();
    }

    public List<String> distinctAcoes() {
        return getEntityManager()
                .createQuery("select distinct a.acao from AuditoriaLog a order by a.acao", String.class)
                .getResultList();
    }

    public List<String> distinctUsuarios() {
        return getEntityManager()
                .createQuery("select distinct a.usuarioNome from AuditoriaLog a order by a.usuarioNome",
                        String.class)
                .getResultList();
    }
}
