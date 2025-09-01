package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "categorias",
       uniqueConstraints = @UniqueConstraint(name = "uk_categorias_nome", columnNames = "nome"))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Categoria {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 80)
  private String nome;

  @Column(columnDefinition = "text")
  private String descricao;

  @Column(nullable = false)
  private boolean ativo = true;

  @CreationTimestamp
  @Column(name = "criado_em", nullable = false, updatable = false)
  private Instant criadoEm;

  @UpdateTimestamp
  @Column(name = "atualizado_em", nullable = false)
  private Instant atualizadoEm;
}
