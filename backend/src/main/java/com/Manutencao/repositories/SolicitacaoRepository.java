package com.Manutencao.repositories;

import com.Manutencao.models.Solicitacao;
import com.Manutencao.models.Categoria;
import com.Manutencao.models.EstadoSolicitacao;
import com.Manutencao.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    /**
     * Busca todas as solicitações de um determinado cliente.
     */
    List<Solicitacao> findByCliente(Usuario cliente);

    /**
     * Busca solicitações por categoria.
     */
    List<Solicitacao> findByCategoria(Categoria categoria);

    /**
     * Busca solicitações por estado atual (ex: ABERTA, ORÇADA, FINALIZADA...).
     */
    List<Solicitacao> findByEstadoAtual(EstadoSolicitacao estado);

    /**
     * Busca solicitações criadas dentro de um intervalo de tempo.
     */
    List<Solicitacao> findByCriadoEmBetween(Instant inicio, Instant fim);

    /**
     * Retorna a contagem de solicitações agrupadas por estado.
     */
    @Query("SELECT s.estadoAtual.nome AS estado, COUNT(s) AS total " +
           "FROM Solicitacao s " +
           "GROUP BY s.estadoAtual.nome " +
           "ORDER BY s.estadoAtual.nome ASC")
    List<Object[]> countSolicitacoesPorEstado();

    /**
     * Retorna a contagem de solicitações por categoria.
     */
    @Query("SELECT s.categoria.nome AS categoria, COUNT(s) AS total " +
           "FROM Solicitacao s " +
           "GROUP BY s.categoria.nome " +
           "ORDER BY s.categoria.nome ASC")
    List<Object[]> countSolicitacoesPorCategoria();

    /**
     * Retorna solicitações de um cliente dentro de um intervalo de tempo.
     */
    @Query("SELECT s FROM Solicitacao s " +
           "WHERE s.cliente = :cliente " +
           "AND s.criadoEm BETWEEN :inicio AND :fim")
    List<Solicitacao> findByClienteAndPeriodo(
            @Param("cliente") Usuario cliente,
            @Param("inicio") Instant inicio,
            @Param("fim") Instant fim);
}
