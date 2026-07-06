package br.com.crisismanagement.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

@Entity
@Table(name = "relatorios_crise")
public class RelatorioCrise extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "titulo", nullable = false, length = 200)
    public String titulo;

    @Column(name = "resumo_ocorrido", nullable = false, length = 2000)
    public String resumoOcorrido;

    @Column(name = "impactos_identificados", length = 2000)
    public String impactosIdentificados;

    @Column(name = "acoes_realizadas", length = 2000)
    public String acoesRealizadas;

    @Column(name = "resultado_final", length = 2000)
    public String resultadoFinal;

    @Column(name = "recomendacoes", length = 2000)
    public String recomendacoes;

    @Column(name = "crise_id", nullable = false, unique = true)
    public Long criseId;

    @Column(name = "usuario_id", nullable = false)
    public Long usuarioId;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;
}
