package br.com.crisismanagement.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

import br.com.crisismanagement.entities.enums.NivelCriticidade;
import br.com.crisismanagement.entities.enums.StatusCrise;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

@Entity
@Table(name = "crises")
public class Crise extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "titulo", nullable = false, length = 200)
    public String titulo;

    @Column(name = "descricao", nullable = false, length = 1000)
    public String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    public StatusCrise status;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel", nullable = false, length = 20)
    public NivelCriticidade nivel;

    @Column(name = "tipo_crise_id", nullable = false)
    public Long tipoCriseId;

    @Column(name = "campus_id", nullable = false)
    public Long campusId;

    @Column(name = "cenario_id")
    public Long cenarioId;

    @Column(name = "departamento_id", nullable = false)
    public Long departamentoId;

    /** Usuario que cadastrou a crise (nulo para crises anteriores a V10). */
    @Column(name = "created_by")
    public Long createdBy;

    @Column(name = "active", nullable = false)
    public boolean active;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;
}
