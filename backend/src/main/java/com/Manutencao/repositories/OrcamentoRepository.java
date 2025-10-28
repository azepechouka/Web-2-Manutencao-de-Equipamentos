package com.Manutencao.repositories;

import com.Manutencao.models.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {
    
    List<Orcamento> findBySolicitacaoIdOrderByCriadoEmDesc(Long solicitacaoId);
    
    @Query("SELECT o FROM Orcamento o WHERE o.criadoEm BETWEEN :dataInicio AND :dataFim ORDER BY o.criadoEm DESC")
    List<Orcamento> findByCriadoEmBetweenOrderByCriadoEmDesc(@Param("dataInicio") LocalDateTime dataInicio, @Param("dataFim") LocalDateTime dataFim);
    
    @Query("SELECT o FROM Orcamento o JOIN o.solicitacao s WHERE s.categoriaEquipamentoId = :categoriaId ORDER BY o.criadoEm DESC")
    List<Orcamento> findBySolicitacaoCategoriaEquipamentoIdOrderByCriadoEmDesc(@Param("categoriaId") Long categoriaId);
}
