package br.com.crisismanagement.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

/**
 * Registro imutável de auditoria: uma linha por ação de modificação
 * (POST/PUT/PATCH/DELETE) executada por um usuário autenticado.
 */
@Entity
@Table(name = "auditoria_logs")
public class AuditoriaLog extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "usuario_id", nullable = false)
    public Long usuarioId;

    @Column(name = "usuario_nome", nullable = false, length = 150)
    public String usuarioNome;

    /** Rótulo amigável da operação: CRIAR, ATUALIZAR, EXCLUIR. */
    @Column(name = "acao", nullable = false, length = 30)
    public String acao;

    @Column(name = "metodo_http", nullable = false, length = 10)
    public String metodoHttp;

    /** Recurso/entidade afetada, derivado do caminho (ex.: "crises", "usuarios"). */
    @Column(name = "entidade_afetada", nullable = false, length = 100)
    public String entidadeAfetada;

    /** Caminho completo requisitado (ex.: "/api/crises/5/acoes"). */
    @Column(name = "recurso", nullable = false, length = 255)
    public String recurso;

    @Column(name = "status_resposta", nullable = false)
    public int statusResposta;

    @Column(name = "data_hora", nullable = false)
    public LocalDateTime dataHora;
}
