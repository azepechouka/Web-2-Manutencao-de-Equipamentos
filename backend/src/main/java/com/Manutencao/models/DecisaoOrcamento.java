package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;


@Entity
@Table(name = "decisoes_orcamento")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DecisaoOrcamento {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "solicitacao_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_dec_solic"))
  private Solicitacao solicitacao;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "cliente_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_dec_cliente"))
  private Usuario cliente;

  @Column(nullable = false)
  private boolean aprovado;

  @Column(name = "motivo_rejeicao", columnDefinition = "text")
  private String motivoRejeicao;

  @CreationTimestamp
  @Column(name = "criado_em", nullable = false, updatable = false)
  private Instant criadoEm;
}
