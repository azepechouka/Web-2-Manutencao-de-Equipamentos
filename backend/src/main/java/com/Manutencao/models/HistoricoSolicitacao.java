package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "historico_solicitacao")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class HistoricoSolicitacao {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(
      name = "solicitacao_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_hist_solic")
  )
  private Solicitacao solicitacao;

  @ManyToOne(fetch = FetchType.LAZY, optional = true)
  @JoinColumn(
      name = "de_estado",
      referencedColumnName = "id",
      foreignKey = @ForeignKey(name = "fk_hist_de_estado")
  )
  private EstadoSolicitacao deEstado;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(
      name = "para_estado",
      referencedColumnName = "id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_hist_para_estado")
  )
  
  private EstadoSolicitacao paraEstado;

  @ManyToOne(fetch = FetchType.LAZY, optional = true)
  @JoinColumn(name = "usuario_id")
  private Usuario usuario;

  @Column(columnDefinition = "text")
  private String observacao;

  @CreationTimestamp
  @Column(name = "criado_em", nullable = false, updatable = false)
  private Instant criadoEm;

  @Enumerated(EnumType.STRING)
  @Column(name = "ator_tipo", nullable = false, length = 20)
  private AtorTipo atorTipo;
}