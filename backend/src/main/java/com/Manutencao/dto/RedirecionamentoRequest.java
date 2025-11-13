package com.Manutencao.api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;


public record RedirecionamentoRequest(
    @NotNull Long destinoFuncionarioId,
    @NotBlank String motivo
) {}
