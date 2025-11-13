package com.Manutencao.api.dto;

public record ManutencaoRequest(
        Long solicitacaoId,
        Long funcionarioId,
        String descricaoManutencao,
        String orientacoesCliente
) {}
