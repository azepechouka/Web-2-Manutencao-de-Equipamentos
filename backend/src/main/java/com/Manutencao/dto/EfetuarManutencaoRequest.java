package com.Manutencao.api.dto;

public record EfetuarManutencaoRequest(
        Long funcionarioId,
        String descricao,
        String orientacoes
) {}
