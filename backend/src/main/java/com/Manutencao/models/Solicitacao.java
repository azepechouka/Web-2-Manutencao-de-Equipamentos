package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;


@Entity
@Table(name = "solicitacoes",
       indexes = {
         @Index(name = "idx_solic_cliente_criado", columnList = "cliente_id, criado_em"),
         @Index(name = "idx_solic_estado_criado", columnList = "estado_atual, criado_em"),
         @Index(name = "idx_solic_categoria", columnList = "categoria_id")
       })
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Solicitacao {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "cliente_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_solic_cliente"))
  private Usuario cliente;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "categoria_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_solic_categoria"))
  private Categoria categoria;

  @Column(name = "descricao_equipamento", nullable = false, length = 255)
  private String descricaoEquipamento;

  @Column(name = "descricao_defeito", nullable = false, columnDefinition = "text")
  private String descricaoDefeito;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "estado_atual", nullable = false,
              foreignKey = @ForeignKey(name = "fk_solic_estado_atual"))
  private EstadoSolicitacao estadoAtual;

  @CreationTimestamp
  @Column(name = "criado_em", nullable = false, updatable = false)
  private Instant criadoEm;

  @UpdateTimestamp
  @Column(name = "atualizado_em", nullable = false)
  private Instant atualizadoEm;
}
