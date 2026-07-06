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

import br.com.crisismanagement.entities.enums.PerfilUsuario;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

@Entity
@Table(name = "users")
public class User extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "name", nullable = false, length = 150)
    public String name;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    public String email;

    @Column(name = "password", nullable = false, length = 255)
    public String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "perfil", nullable = false, length = 20)
    public PerfilUsuario perfil;

    @Column(name = "departamento_id")
    public Long departamentoId;

    @Column(name = "active", nullable = false)
    public boolean active;

    @Column(name = "must_change_password", nullable = false)
    public boolean mustChangePassword;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;
}
