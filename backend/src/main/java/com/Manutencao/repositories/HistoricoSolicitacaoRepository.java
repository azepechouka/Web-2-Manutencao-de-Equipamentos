package com.Manutencao.repositories;

import com.Manutencao.models.HistoricoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistoricoSolicitacaoRepository extends JpaRepository<HistoricoSolicitacao, Long> {

    List<HistoricoSolicitacao> findBySolicitacaoIdOrderByCriadoEmAsc(Long solicitacaoId);
}
