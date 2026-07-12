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

    @Column(name = "instituicao_id")
    public Long instituicaoId;

    @Column(name = "cargo", length = 100)
    public String cargo;

    @Column(name = "active", nullable = false)
    public boolean active;

    @Column(name = "must_change_password", nullable = false)
    public boolean mustChangePassword;

    /** Hash SHA-256 do token de recuperacao de senha (nulo fora do fluxo). */
    @Column(name = "reset_token", length = 64)
    public String resetToken;

    @Column(name = "reset_token_expires_at")
    public LocalDateTime resetTokenExpiresAt;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;
}
