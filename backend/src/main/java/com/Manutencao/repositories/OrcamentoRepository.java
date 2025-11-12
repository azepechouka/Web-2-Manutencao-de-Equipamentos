package com.Manutencao.repositories;

import com.Manutencao.models.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {

    // Busca um orçamento vinculado a uma solicitação específica (OneToOne)
    Optional<Orcamento> findBySolicitacaoId(Long solicitacaoId);
    // Verifica se já existe orçamento para a solicitação (controle de unicidade)
    boolean existsBySolicitacaoId(Long solicitacaoId);
}
