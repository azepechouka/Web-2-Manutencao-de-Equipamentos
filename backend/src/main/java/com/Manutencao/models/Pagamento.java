package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "pagamentos",
       uniqueConstraints = @UniqueConstraint(name = "uk_pag_solic", columnNames = "solicitacao_id"))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Pagamento {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "solicitacao_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_pag_solic"))
  private Solicitacao solicitacao;

  @Column(name = "valor_centavos", nullable = false)
  private Long valorCentavos;

  @Column(name = "forma_pagamento", length = 30)
  private String formaPagamento; // PIX, CARTAO, DINHEIRO

  @CreationTimestamp
  @Column(name = "confirmado_em", nullable = false, updatable = false)
  private Instant confirmadoEm;
}
