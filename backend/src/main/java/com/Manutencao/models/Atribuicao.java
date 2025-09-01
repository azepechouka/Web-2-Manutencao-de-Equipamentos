package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "atribuicoes")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Atribuicao {

  @Id
  @Column(name = "solicitacao_id")
  private Long solicitacaoId;

  @OneToOne(fetch = FetchType.LAZY)
  @MapsId
  @JoinColumn(name = "solicitacao_id",
              foreignKey = @ForeignKey(name = "fk_atrib_solic"))
  private Solicitacao solicitacao;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "funcionario_responsavel",
              foreignKey = @ForeignKey(name = "fk_atrib_func"))
  private Usuario funcionarioResponsavel;

  @UpdateTimestamp
  @Column(name = "atualizado_em", nullable = false)
  private Instant atualizadoEm;
}
