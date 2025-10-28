package com.Manutencao.repositories;

import com.Manutencao.models.EstadoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstadoSolicitacaoRepository extends JpaRepository<EstadoSolicitacao, String> {
}
