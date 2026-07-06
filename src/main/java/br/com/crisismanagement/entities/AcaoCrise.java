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

import br.com.crisismanagement.entities.enums.TipoAcao;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

@Entity
@Table(name = "acoes_crise")
public class AcaoCrise extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "descricao", nullable = false, length = 1000)
    public String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 20)
    public TipoAcao tipo;

    @Column(name = "crise_id", nullable = false)
    public Long criseId;

    @Column(name = "usuario_id", nullable = false)
    public Long usuarioId;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;
}
