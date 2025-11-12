package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;

@Entity
@Table(name = "historico_solicitacao")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricoSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "solicitacao_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_hist_solic"))
    private Solicitacao solicitacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "de_estado_id",
            foreignKey = @ForeignKey(name = "fk_hist_de_estado"))
    private EstadoSolicitacao deEstado;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "para_estado_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_hist_para_estado"))
    private EstadoSolicitacao paraEstado;

    @Column(columnDefinition = "text")
    private String observacao;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;
}
