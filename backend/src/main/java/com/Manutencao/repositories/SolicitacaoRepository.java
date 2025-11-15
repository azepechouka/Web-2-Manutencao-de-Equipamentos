package com.Manutencao.repositories;

import com.Manutencao.models.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.Instant;

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

    @Query("""
        SELECT s FROM Solicitacao s
                JOIN FETCH s.estadoAtual ea
                JOIN FETCH s.cliente c
                JOIN FETCH s.categoria cat
                LEFT JOIN FETCH s.funcionarioDirecionado fd
            WHERE (ea.nome = 'Finalizada' OR ea.nome = 'Paga')
                AND (:dataIni IS NULL OR s.criadoEm >= :dataIni)
                AND (:dataFim IS NULL OR s.criadoEm <= :dataFim)
        """)
    List<Solicitacao> buscarParaRelatorio(
            @Param("dataIni") Instant dataIni,
            @Param("dataFim") Instant dataFim
    );


    public interface ReceitaCategoriaProjection {
        String getCategoriaNome();
        Long getTotalReceita();
        Long getQuantidadeSolicitacoes();
    }
    
    @Query(value = """
        SELECT cat.nome AS categoriaNome,
               COALESCE(SUM(o.valor), 0) AS totalReceita,
               COUNT(s.id) AS quantidadeSolicitacoes
        FROM solicitacoes s
        JOIN estados_solicitacao ea ON ea.id = s.estado_atual_id
        JOIN categorias cat ON cat.id = s.categoria_id
        LEFT JOIN orcamentos o ON o.solicitacao_id = s.id
        WHERE ea.nome IN ('Finalizada', 'Paga')
        GROUP BY cat.id, cat.nome
        ORDER BY cat.nome
    """, nativeQuery = true)
    List<ReceitaCategoriaProjection> findReceitaPorCategoria();
    
    @Query("""
        SELECT s FROM Solicitacao s 
        JOIN s.estadoAtual ea 
        JOIN s.categoria cat 
        WHERE cat.nome = :categoriaNome 
        AND ea.nome IN ('Finalizada', 'Paga')
    """)
    List<Solicitacao> findByCategoriaNomeAndEstado(@Param("categoriaNome") String categoriaNome);
    
    List<Solicitacao> findByEstadoAtualNomeIn(List<String> estados);
}