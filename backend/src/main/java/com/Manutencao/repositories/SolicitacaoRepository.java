package com.Manutencao.repositories;

import com.Manutencao.models.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    
    List<Solicitacao> findByClienteIdOrderByCriadoEmDesc(Long clienteId);
    
    @Query("SELECT s FROM Solicitacao s WHERE s.statusAtualId IN :statusIds ORDER BY s.criadoEm DESC")
    List<Solicitacao> findByStatusAtualIdInOrderByCriadoEmDesc(@Param("statusIds") List<Long> statusIds);
    
    @Query("SELECT s FROM Solicitacao s WHERE s.categoriaEquipamentoId = :categoriaId ORDER BY s.criadoEm DESC")
    List<Solicitacao> findByCategoriaEquipamentoIdOrderByCriadoEmDesc(@Param("categoriaId") Long categoriaId);
}
