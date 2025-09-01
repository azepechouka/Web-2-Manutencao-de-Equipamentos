package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "enderecos")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Endereco {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "usuario_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_endereco_usuario"))
  private Usuario usuario;

  @Column(nullable = false, length = 8)
  private String cep;

  @Column(nullable = false, length = 150)
  private String logradouro;

  @Column(nullable = false, length = 20)
  private String numero;

  @Column(length = 100)
  private String complemento;

  @Column(nullable = false, length = 100)
  private String bairro;

  @Column(nullable = false, length = 100)
  private String cidade;

  @Column(nullable = false, length = 2)
  private String uf;

  @Column(length = 7)
  private String ibge;

  @Column(length = 3)
  private String ddd;

  @CreationTimestamp
  @Column(name = "criado_em", nullable = false, updatable = false)
  private Instant criadoEm;
}