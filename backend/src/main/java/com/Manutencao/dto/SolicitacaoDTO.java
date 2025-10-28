package com.Manutencao.api.dto;

import java.time.Instant;

public record SolicitacaoDTO(
        Long id,
        Long clienteId,
        String clienteNome,
        Long categoriaId,
        String categoriaNome,
        String descricaoEquipamento,
        String descricaoDefeito,
        String estadoId,
        String estadoNome,
        Instant criadoEm,
        Instant atualizadoEm
) {}
