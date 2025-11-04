package com.Manutencao.mappers;

import com.Manutencao.dto.OrcamentoRequest;
import com.Manutencao.dto.OrcamentoResponse;
import com.Manutencao.models.Orcamento;
import com.Manutencao.models.Solicitacao;
import com.Manutencao.models.Usuario;

public class OrcamentoMapper {

    public static Orcamento toEntity(
            OrcamentoRequest request,
            Solicitacao solicitacao,
            Usuario funcionario
    ) {
        return Orcamento.builder()
                .solicitacao(solicitacao)
                .valorTotal(request.getValorTotal())
                .funcionario(funcionario)
                .build();
    }

    public static OrcamentoResponse toResponse(Orcamento orcamento) {
        return OrcamentoResponse.builder()
                .id(orcamento.getId())
                .solicitacaoId(orcamento.getSolicitacao().getId())
                .valorTotal(orcamento.getValorTotal())
                .funcionarioId(orcamento.getFuncionario().getId())
                .funcionarioNome(orcamento.getFuncionario().getNome())
                .criadoEm(orcamento.getCriadoEm())
                .build();
    }

    public static void copyToEntity(
            OrcamentoRequest request,
            Orcamento entity,
            Solicitacao solicitacao,
            Usuario funcionario
    ) {
        entity.setSolicitacao(solicitacao);
        entity.setValorTotal(request.getValorTotal());
        entity.setFuncionario(funcionario);
    }
}
