package com.Manutencao.mappers;

import com.Manutencao.dto.SolicitacaoRequest;
import com.Manutencao.dto.SolicitacaoResponse;
import com.Manutencao.models.Solicitacao;
import com.Manutencao.models.EstadoSolicitacao;
import com.Manutencao.models.Usuario;
import com.Manutencao.models.Categoria;

public class SolicitacaoMapper {
    
    public static Solicitacao toEntity(SolicitacaoRequest request) {
        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setClienteId(request.getClienteId());
        solicitacao.setDescricaoEquipamento(request.getDescricaoEquipamento());
        solicitacao.setModeloEquipamento(request.getModeloEquipamento());
        solicitacao.setNumeroSerieEquipamento(request.getNumeroSerieEquipamento());
        solicitacao.setCategoriaEquipamentoId(request.getCategoriaEquipamentoId());
        solicitacao.setObservacoes(request.getObservacoes());
        solicitacao.setEnderecoId(request.getEnderecoId());
        solicitacao.setStatusAtualId(1L); // Status inicial: CRIADA
        return solicitacao;
    }
    
    public static SolicitacaoResponse toResponse(Solicitacao solicitacao) {
        SolicitacaoResponse response = new SolicitacaoResponse();
        response.setId(solicitacao.getId());
        response.setClienteId(solicitacao.getClienteId());
        response.setDescricaoEquipamento(solicitacao.getDescricaoEquipamento());
        response.setModeloEquipamento(solicitacao.getModeloEquipamento());
        response.setNumeroSerieEquipamento(solicitacao.getNumeroSerieEquipamento());
        response.setCategoriaEquipamentoId(solicitacao.getCategoriaEquipamentoId());
        response.setObservacoes(solicitacao.getObservacoes());
        response.setEnderecoId(solicitacao.getEnderecoId());
        response.setStatusAtualId(solicitacao.getStatusAtualId());
        response.setCriadoEm(solicitacao.getCriadoEm());
        response.setAtualizadoEm(solicitacao.getAtualizadoEm());
        return response;
    }
    
    public static SolicitacaoResponse toResponseWithDetails(Solicitacao solicitacao, 
                                                           Usuario cliente, 
                                                           Categoria categoria, 
                                                           EstadoSolicitacao status) {
        SolicitacaoResponse response = toResponse(solicitacao);
        response.setClienteNome(cliente != null ? cliente.getNome() : null);
        response.setCategoriaEquipamentoNome(categoria != null ? categoria.getNome() : null);
        response.setStatusAtualNome(status != null ? status.getNome() : null);
        response.setStatusAtualCodigo(status != null ? status.getCodigo() : null);
        return response;
    }
    
    public static void copyToEntity(SolicitacaoRequest request, Solicitacao entity) {
        entity.setDescricaoEquipamento(request.getDescricaoEquipamento());
        entity.setModeloEquipamento(request.getModeloEquipamento());
        entity.setNumeroSerieEquipamento(request.getNumeroSerieEquipamento());
        entity.setCategoriaEquipamentoId(request.getCategoriaEquipamentoId());
        entity.setObservacoes(request.getObservacoes());
        entity.setEnderecoId(request.getEnderecoId());
    }
}
