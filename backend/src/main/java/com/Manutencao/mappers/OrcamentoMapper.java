package com.Manutencao.mappers;

import com.Manutencao.dto.OrcamentoRequest;
import com.Manutencao.dto.OrcamentoResponse;
import com.Manutencao.models.Orcamento;
import com.Manutencao.models.Usuario;

public class OrcamentoMapper {
    
    public static Orcamento toEntity(OrcamentoRequest request) {
        Orcamento orcamento = new Orcamento();
        orcamento.setSolicitacaoId(request.getSolicitacaoId());
        orcamento.setValorTotal(request.getValorTotal());
        orcamento.setMoeda(request.getMoeda());
        orcamento.setObservacao(request.getObservacao());
        orcamento.setFuncionarioId(request.getFuncionarioId());
        return orcamento;
    }
    
    public static OrcamentoResponse toResponse(Orcamento orcamento) {
        OrcamentoResponse response = new OrcamentoResponse();
        response.setId(orcamento.getId());
        response.setSolicitacaoId(orcamento.getSolicitacaoId());
        response.setValorTotal(orcamento.getValorTotal());
        response.setMoeda(orcamento.getMoeda());
        response.setObservacao(orcamento.getObservacao());
        response.setFuncionarioId(orcamento.getFuncionarioId());
        response.setCriadoEm(orcamento.getCriadoEm());
        return response;
    }
    
    public static OrcamentoResponse toResponseWithDetails(Orcamento orcamento, Usuario funcionario) {
        OrcamentoResponse response = toResponse(orcamento);
        response.setFuncionarioNome(funcionario != null ? funcionario.getNome() : null);
        return response;
    }
    
    public static void copyToEntity(OrcamentoRequest request, Orcamento entity) {
        entity.setValorTotal(request.getValorTotal());
        entity.setMoeda(request.getMoeda());
        entity.setObservacao(request.getObservacao());
        entity.setFuncionarioId(request.getFuncionarioId());
    }
}
