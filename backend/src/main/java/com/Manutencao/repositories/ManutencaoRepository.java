package com.Manutencao.repositories;

import com.Manutencao.models.Manutencao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {
    
    List<Manutencao> findBySolicitacaoIdOrderByCriadoEmDesc(Long solicitacaoId);
    
    List<Manutencao> findByFuncionarioIdOrderByCriadoEmDesc(Long funcionarioId);
    
    @Query("SELECT m FROM Manutencao m WHERE m.status = :status ORDER BY m.criadoEm DESC")
    List<Manutencao> findByStatusOrderByCriadoEmDesc(@Param("status") String status);
}
