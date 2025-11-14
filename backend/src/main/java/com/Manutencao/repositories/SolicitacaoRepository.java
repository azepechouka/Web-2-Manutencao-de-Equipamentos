package com.Manutencao.repositories;

import com.Manutencao.models.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    List<Solicitacao> findByCliente_Id(Long clienteId);

    @Query("""
        SELECT s FROM Solicitacao s
        JOIN FETCH s.estadoAtual
        JOIN FETCH s.categoria
        JOIN FETCH s.cliente
        WHERE s.cliente.id = :clienteId
    """)
    List<Solicitacao> findByCliente_IdWithFetch(@Param("clienteId") Long clienteId);

    @Query("""
        SELECT s FROM Solicitacao s
        LEFT JOIN FETCH s.categoria
        LEFT JOIN FETCH s.cliente
        LEFT JOIN FETCH s.estadoAtual
        WHERE s.id = :id
    """)
    Solicitacao findByIdComFetch(@Param("id") Long id);

    @Query("""
    SELECT s
        FROM Solicitacao s
        JOIN FETCH s.estadoAtual ea
        JOIN FETCH s.cliente c
        JOIN FETCH s.categoria cat
        WHERE LOWER(ea.nome) = LOWER(:nome)
    """)
    List<Solicitacao> findByEstadoAtual_NomeIgnoreCase(@Param("nome") String nome);

    @Query("""
        SELECT s FROM Solicitacao s
        JOIN FETCH s.cliente
        JOIN FETCH s.categoria
        JOIN FETCH s.estadoAtual
    """)
    List<Solicitacao> findAllWithFetch();

    // MÉTODO CORRIGIDO - usando JPQL com JOIN FETCH
    @Query("""
        SELECT s FROM Solicitacao s
        JOIN FETCH s.estadoAtual ea
        JOIN FETCH s.cliente
        JOIN FETCH s.categoria
        LEFT JOIN FETCH s.funcionarioDirecionado fd
        WHERE (ea.nome != 'Redirecionada'
               OR (ea.nome = 'Redirecionada' AND fd.id = :usuarioId))
    """)
    List<Solicitacao> findSolicitacoesByUsuario(@Param("usuarioId") Long usuarioId);
}