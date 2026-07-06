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
@Table(name = "cenarios_crise")
public class CenarioCrise extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "descricao", nullable = false, length = 500)
    public String descricao;

    @Column(name = "nivel_sugerido", length = 50)
    public String nivelSugerido;

    @Column(name = "tipo_crise_id", nullable = false)
    public Long tipoCriseId;

    @Column(name = "departamento_id", nullable = false)
    public Long departamentoId;

    @Column(name = "active", nullable = false)
    public boolean active;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;
}
