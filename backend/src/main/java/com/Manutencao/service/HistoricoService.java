package com.Manutencao.service;

import com.Manutencao.dto.HistoricoRequest;
import com.Manutencao.dto.HistoricoResponse;
import com.Manutencao.models.HistoricoSolicitacao;
import com.Manutencao.models.Usuario;
import com.Manutencao.repositories.HistoricoSolicitacaoRepository;
import com.Manutencao.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoricoService {

    private final HistoricoSolicitacaoRepository repo;
    private final UsuarioRepository usuarioRepo;

    public HistoricoService(HistoricoSolicitacaoRepository repo, UsuarioRepository usuarioRepo) {
        this.repo = repo;
        this.usuarioRepo = usuarioRepo;
    }

    @Transactional(readOnly = true)
    public List<HistoricoResponse> listarPorSolicitacao(Long solicitacaoId) {
        return repo.findBySolicitacaoIdOrderByCriadoEmDesc(solicitacaoId).stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HistoricoResponse> listarPorUsuario(Long usuarioId) {
        return repo.findByUsuarioIdOrderByCriadoEmDesc(usuarioId).stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional
    public HistoricoResponse criar(HistoricoRequest request) {
        HistoricoSolicitacao entity = new HistoricoSolicitacao();
        entity.setSolicitacaoId(request.getSolicitacaoId());
        entity.setDeStatusId(request.getDeStatusId());
        entity.setParaStatusId(request.getParaStatusId());
        entity.setUsuarioId(request.getUsuarioId());
        entity.setObservacao(request.getObservacao());
        entity.setCriadoEm(LocalDateTime.now());
        
        entity = repo.save(entity);
        return toResponseWithDetails(entity);
    }

    private HistoricoResponse toResponseWithDetails(HistoricoSolicitacao historico) {
        Usuario usuario = historico.getUsuarioId() != null ? 
            usuarioRepo.findById(historico.getUsuarioId()).orElse(null) : null;
        
        HistoricoResponse response = new HistoricoResponse();
        response.setId(historico.getId());
        response.setSolicitacaoId(historico.getSolicitacaoId());
        response.setDeStatusId(historico.getDeStatusId());
        response.setDeStatusNome(getStatusNome(historico.getDeStatusId()));
        response.setParaStatusId(historico.getParaStatusId());
        response.setParaStatusNome(getStatusNome(historico.getParaStatusId()));
        response.setUsuarioId(historico.getUsuarioId());
        response.setUsuarioNome(usuario != null ? usuario.getNome() : "Sistema");
        response.setObservacao(historico.getObservacao());
        response.setCriadoEm(historico.getCriadoEm());
        
        return response;
    }

    private String getStatusNome(Long statusId) {
        if (statusId == null) return null;
        
        return switch (statusId.intValue()) {
            case 1 -> "Criada";
            case 2 -> "Orçada";
            case 3 -> "Aprovada";
            case 4 -> "Rejeitada";
            case 5 -> "Em execução";
            case 6 -> "Concluída";
            default -> "Desconhecido";
        };
    }
}
