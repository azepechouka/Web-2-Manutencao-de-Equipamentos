package com.Manutencao.api.dto;

import com.Manutencao.models.Solicitacao;
import java.time.Instant;

public record SolicitacaoResponse(
    Long id,
    String descricaoEquipamento,
    String descricaoDefeito,
    String estadoAtual,
    String clienteNome,
    Long clienteId,
    String categoriaNome,
    Instant criadoEm,
    String descricaoManutencao,
    String orientacoesCliente,
    String nomeFunc,
    Long funcionarioDirecionadoId
) {
    public static SolicitacaoResponse from(Solicitacao s) {
        return from(s, null);
    }

    public static SolicitacaoResponse from(Solicitacao s, String nomeFunc) {
        Long funcionarioDirecionadoId = null;
        if (s.getFuncionarioDirecionado() != null) {
            funcionarioDirecionadoId = s.getFuncionarioDirecionado().getId();
        }
        
        return new SolicitacaoResponse(
            s.getId(),
            s.getDescricaoEquipamento(),
            s.getDescricaoDefeito(),
            s.getEstadoAtual().getNome(),
            s.getCliente().getNome(),
            s.getCliente().getId(),
            s.getCategoria().getNome(),
            s.getCriadoEm(),
            s.getDescricaoManutencao(),
            s.getOrientacoesCliente(),
            nomeFunc,
            funcionarioDirecionadoId
        );
    }
}