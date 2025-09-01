package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "redirecionamentos",
       indexes = @Index(name = "idx_redir_destino", columnList = "funcionario_destino_id, criado_em"))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Redirecionamento {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "solicitacao_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_redir_solic"))
  private Solicitacao solicitacao;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "funcionario_origem_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_redir_func_origem"))
  private Usuario funcionarioOrigem;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "funcionario_destino_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_redir_func_destino"))
  private Usuario funcionarioDestino;

  @CreationTimestamp
  @Column(name = "criado_em", nullable = false, updatable = false)
  private Instant criadoEm;
}
