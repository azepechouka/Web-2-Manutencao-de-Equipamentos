package com.Manutencao.api.dto;

import java.math.BigDecimal;

public record OrcamentoRequest(
        Long solicitacaoId,
        BigDecimal valorTotal,
        Long funcionarioId
) {}
