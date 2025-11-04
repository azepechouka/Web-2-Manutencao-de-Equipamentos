package com.Manutencao.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class OrcamentoResponse {
    private Long id;
    private Long solicitacaoId;
    private BigDecimal valorTotal;
    private Long funcionarioId;
    private String funcionarioNome;
    private String observacao;
    private Instant criadoEm;
}
