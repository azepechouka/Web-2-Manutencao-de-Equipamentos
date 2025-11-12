package com.Manutencao.services;

import com.Manutencao.dto.HistoricoStatusResponse;
import com.Manutencao.repositories.HistoricoSolicitacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HistoricoService {

    private final HistoricoSolicitacaoRepository historicoRepo;

    public HistoricoService(HistoricoSolicitacaoRepository historicoRepo) {
        this.historicoRepo = historicoRepo;
    }

    @Transactional(readOnly = true)
    public List<HistoricoStatusResponse> listarPorSolicitacao(Long solicitacaoId) {
        return historicoRepo.findBySolicitacaoIdOrderByCriadoEmAsc(solicitacaoId)
                .stream()
                .map(HistoricoStatusResponse::from)
                .toList();
    }
}
