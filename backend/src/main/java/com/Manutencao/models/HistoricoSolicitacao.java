package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "historico_solicitacoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricoSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitacao_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_historico_solicitacao"))
    private Solicitacao solicitacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "de_status_id", foreignKey = @ForeignKey(name = "fk_historico_de_status"))
    private EstadoSolicitacao deStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "para_status_id", foreignKey = @ForeignKey(name = "fk_historico_para_status"))
    private EstadoSolicitacao paraStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", foreignKey = @ForeignKey(name = "fk_historico_usuario"))
    private Usuario usuario;

    @Column(columnDefinition = "text")
    private String observacao;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;
}
