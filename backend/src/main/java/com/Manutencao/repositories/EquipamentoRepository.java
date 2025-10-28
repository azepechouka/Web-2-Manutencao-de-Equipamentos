package com.Manutencao.repositories;

import com.Manutencao.models.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {
    
    List<Equipamento> findByClienteIdOrderByCriadoEmDesc(Long clienteId);
    
    List<Equipamento> findByCategoriaIdOrderByCriadoEmDesc(Long categoriaId);
    
    @Query("SELECT e FROM Equipamento e WHERE e.numeroSerie = :numeroSerie")
    List<Equipamento> findByNumeroSerie(@Param("numeroSerie") String numeroSerie);
}
