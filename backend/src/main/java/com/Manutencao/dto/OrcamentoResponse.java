package com.Manutencao.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrcamentoResponse {
    
    private Long id;
    private Long solicitacaoId;
    private BigDecimal valorTotal;
    private String moeda;
    private String observacao;
    private Long funcionarioId;
    private String funcionarioNome;
    private Instant criadoEm;
}
