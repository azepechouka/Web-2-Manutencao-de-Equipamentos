package com.Manutencao.api.dto;

public record RedirecionarManutencaoRequest(
        Long destinoFuncionarioId,
        String motivo
) {}
