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
@Table(name = "tipos_crise")
public class TipoCrise extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "nome", nullable = false, length = 150)
    public String nome;

    @Column(name = "descricao", length = 500)
    public String descricao;

    @Column(name = "active", nullable = false)
    public boolean active;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;
}
