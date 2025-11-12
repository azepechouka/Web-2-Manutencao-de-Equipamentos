package com.Manutencao.repositories;

import com.Manutencao.models.EstadoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoSolicitacaoRepository extends JpaRepository<EstadoSolicitacao, Long> {
    Optional<EstadoSolicitacao> findByNomeIgnoreCase(String nome);
    Optional<EstadoSolicitacao> findByNome(String nome);

}
