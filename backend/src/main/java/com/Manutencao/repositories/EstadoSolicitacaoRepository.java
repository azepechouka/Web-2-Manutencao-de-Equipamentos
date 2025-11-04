package com.Manutencao.repositories;

import com.Manutencao.models.EstadoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstadoSolicitacaoRepository extends JpaRepository<EstadoSolicitacao, Long> {
}
