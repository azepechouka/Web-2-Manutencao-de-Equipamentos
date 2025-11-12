package com.Manutencao.api.dto;

import java.time.Instant;

public record OrcamentoResponse(
        Long id,
        Long solicitacaoId,
        String funcionarioNome,
        Long valor,
        Instant criadoEm
) {}
