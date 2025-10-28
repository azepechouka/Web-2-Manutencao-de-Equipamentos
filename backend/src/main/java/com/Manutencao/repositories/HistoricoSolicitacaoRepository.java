package com.Manutencao.repositories;

import com.Manutencao.models.HistoricoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricoSolicitacaoRepository extends JpaRepository<HistoricoSolicitacao, Long> {
    
    List<HistoricoSolicitacao> findBySolicitacaoIdOrderByCriadoEmDesc(Long solicitacaoId);
    
    @Query("SELECT h FROM HistoricoSolicitacao h WHERE h.usuarioId = :usuarioId ORDER BY h.criadoEm DESC")
    List<HistoricoSolicitacao> findByUsuarioIdOrderByCriadoEmDesc(@Param("usuarioId") Long usuarioId);
}
