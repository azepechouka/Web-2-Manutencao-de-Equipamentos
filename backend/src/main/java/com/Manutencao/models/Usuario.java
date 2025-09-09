package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "usuarios",
       uniqueConstraints = {
         @UniqueConstraint(name = "uk_usuarios_email", columnNames = "email"),
         @UniqueConstraint(name = "uk_usuarios_cpf", columnNames = "cpf")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 150)
  private String nome;

  // MySQL: use VARCHAR normal (collation do banco cuida do case-insensitive)
  @Column(nullable = false, length = 255)
  private String email;

  @Column(length = 11)
  private String cpf;

  @Column(length = 20)
  private String telefone;

  private LocalDate dataNascimento;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private PerfilUsuario perfil;

 @Column(name = "senha_hash", nullable = false, length = 512)
  private String senhaHash;

  @Column(name = "senha_salt", nullable = false, length = 256)
  private String senhaSalt;

  @Column(nullable = false)
  private boolean ativo = true;

  @CreationTimestamp
  @Column(name = "criado_em", nullable = false, updatable = false)
  private Instant criadoEm;

  @UpdateTimestamp
  @Column(name = "atualizado_em", nullable = false)
  private Instant atualizadoEm;
}
