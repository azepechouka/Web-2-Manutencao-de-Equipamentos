package com.Manutencao.service;

import com.Manutencao.dto.HistoricoRequest;
import com.Manutencao.dto.HistoricoResponse;
import com.Manutencao.models.*;
import com.Manutencao.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoricoService {

    private final HistoricoSolicitacaoRepository historicoRepo;
    private final SolicitacaoRepository solicitacaoRepo;
    private final EstadoSolicitacaoRepository estadoRepo;
    private final UsuarioRepository usuarioRepo;

    public HistoricoService(HistoricoSolicitacaoRepository historicoRepo,
                            SolicitacaoRepository solicitacaoRepo,
                            EstadoSolicitacaoRepository estadoRepo,
                            UsuarioRepository usuarioRepo) {
        this.historicoRepo = historicoRepo;
        this.solicitacaoRepo = solicitacaoRepo;
        this.estadoRepo = estadoRepo;
        this.usuarioRepo = usuarioRepo;
    }

    @Transactional(readOnly = true)
    public List<HistoricoResponse> listarPorSolicitacao(Long solicitacaoId) {
        return historicoRepo.findBySolicitacaoIdOrderByCriadoEmDesc(solicitacaoId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HistoricoResponse> listarPorUsuario(Long usuarioId) {
        return historicoRepo.findByUsuarioIdOrderByCriadoEmDesc(usuarioId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public HistoricoResponse criar(HistoricoRequest req) {
        Solicitacao solicitacao = solicitacaoRepo.findById(req.getSolicitacaoId())
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));

        EstadoSolicitacao deStatus = req.getDeStatusId() != null
                ? estadoRepo.findById(req.getDeStatusId()).orElse(null)
                : null;

        EstadoSolicitacao paraStatus = req.getParaStatusId() != null
                ? estadoRepo.findById(req.getParaStatusId()).orElse(null)
                : null;

        Usuario usuario = req.getUsuarioId() != null
                ? usuarioRepo.findById(req.getUsuarioId()).orElse(null)
                : null;

        HistoricoSolicitacao entity = HistoricoSolicitacao.builder()
                .solicitacao(solicitacao)
                .deStatus(deStatus)
                .paraStatus(paraStatus)
                .usuario(usuario)
                .observacao(req.getObservacao())
                .criadoEm(LocalDateTime.now())
                .build();

        entity = historicoRepo.save(entity);
        return toResponse(entity);
    }

    private HistoricoResponse toResponse(HistoricoSolicitacao h) {
        return HistoricoResponse.builder()
                .id(h.getId())
                .solicitacaoId(h.getSolicitacao().getId())
                .deStatusId(h.getDeStatus() != null ? h.getDeStatus().getId() : null)
                .deStatusNome(h.getDeStatus() != null ? h.getDeStatus().getNome() : null)
                .paraStatusId(h.getParaStatus() != null ? h.getParaStatus().getId() : null)
                .paraStatusNome(h.getParaStatus() != null ? h.getParaStatus().getNome() : null)
                .usuarioId(h.getUsuario() != null ? h.getUsuario().getId() : null)
                .usuarioNome(h.getUsuario() != null ? h.getUsuario().getNome() : "Sistema")
                .observacao(h.getObservacao())
                .criadoEm(h.getCriadoEm())
                .build();
    }
}
