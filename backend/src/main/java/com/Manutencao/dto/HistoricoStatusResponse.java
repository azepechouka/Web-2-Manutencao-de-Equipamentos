package com.Manutencao.dto;

import com.Manutencao.models.HistoricoSolicitacao;
import lombok.Builder;

import java.time.Instant;

@Builder
public record HistoricoStatusResponse(
        Long id,
        String deEstado,
        String paraEstado,
        String observacao,
        Instant criadoEm
) {
    public static HistoricoStatusResponse from(HistoricoSolicitacao entity) {
        return HistoricoStatusResponse.builder()
                .id(entity.getId())
                .deEstado(entity.getDeEstado() != null ? entity.getDeEstado().getNome() : null)
                .paraEstado(entity.getParaEstado() != null ? entity.getParaEstado().getNome() : null)
                .observacao(entity.getObservacao())
                .criadoEm(entity.getCriadoEm())
                .build();
    }
}
