package com.Manutencao.api.dto;

import com.Manutencao.models.Solicitacao;
import java.time.Instant;

public record SolicitacaoResponse(
    Long id,
    String descricaoEquipamento,
    String descricaoDefeito,
    String estadoAtual,
    String clienteNome,
    String categoriaNome,
    Instant criadoEm
) {
    public static SolicitacaoResponse from(Solicitacao s) {
        return new SolicitacaoResponse(
            s.getId(),
            s.getDescricaoEquipamento(),
            s.getDescricaoDefeito(),
            s.getEstadoAtual().getNome(),
            s.getCliente().getNome(),
            s.getCategoria().getNome(),
            s.getCriadoEm()
        );
    }
}
