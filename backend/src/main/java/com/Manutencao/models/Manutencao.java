package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;


@Entity
@Table(name = "manutencoes",
       uniqueConstraints = @UniqueConstraint(name = "uk_manut_solic", columnNames = "solicitacao_id"))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Manutencao {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "solicitacao_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_manut_solic"))
  private Solicitacao solicitacao;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "funcionario_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_manut_func"))
  private Usuario funcionario;

  @Column(name = "descricao_manutencao", nullable = false, columnDefinition = "text")
  private String descricaoManutencao;

  @Column(name = "orientacoes_cliente", columnDefinition = "text")
  private String orientacoesCliente;

  @CreationTimestamp
  @Column(name = "criado_em", nullable = false, updatable = false)
  private Instant criadoEm;
}
