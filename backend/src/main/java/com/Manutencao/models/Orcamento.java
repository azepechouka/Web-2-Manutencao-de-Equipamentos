package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "orcamentos",
       uniqueConstraints = @UniqueConstraint(name = "uk_orc_solic", columnNames = "solicitacao_id"))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Orcamento {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "solicitacao_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_orc_solic"))
  private Solicitacao solicitacao;

  @Column(name = "valor_total", nullable = false)
  private BigDecimal  valorTotal;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "funcionario_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_orc_func"))
  private Usuario funcionario;


  @Column(columnDefinition = "text")
  private String observacao;

  @CreationTimestamp
  @Column(name = "criado_em", nullable = false, updatable = false)
  private Instant criadoEm;
}