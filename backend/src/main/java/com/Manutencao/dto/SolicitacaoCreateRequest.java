package com.Manutencao.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SolicitacaoCreateRequest(
    @NotNull Long clienteId,
    @NotNull Long categoriaId,
    @NotBlank String descricaoEquipamento,
    @NotBlank String descricaoDefeito
) {}
