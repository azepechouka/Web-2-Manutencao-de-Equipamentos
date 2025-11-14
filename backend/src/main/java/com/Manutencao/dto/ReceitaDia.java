package com.Manutencao.api.dto;

import java.util.List;

import com.Manutencao.api.dto.SolicitacaoResponse;

public record ReceitaDia(
        String data,
        Double totalReceita,
        Integer quantidadeServicos,
        List<SolicitacaoResponse> solicitacoes
) {}
