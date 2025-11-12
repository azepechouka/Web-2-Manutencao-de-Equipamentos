package com.Manutencao.services;

import com.Manutencao.api.dto.OrcamentoRequest;
import com.Manutencao.api.dto.OrcamentoResponse;
import com.Manutencao.models.Orcamento;
import com.Manutencao.models.Solicitacao;
import com.Manutencao.models.Usuario;
import com.Manutencao.models.EstadoSolicitacao;
import com.Manutencao.repositories.OrcamentoRepository;
import com.Manutencao.repositories.SolicitacaoRepository;
import com.Manutencao.repositories.UsuarioRepository;
import com.Manutencao.repositories.EstadoSolicitacaoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class OrcamentoService {

    private final OrcamentoRepository orcamentos;
    private final SolicitacaoRepository solicitacoes;
    private final UsuarioRepository usuarios;
    private final EstadoSolicitacaoRepository estados;

    public OrcamentoService(
            OrcamentoRepository orcamentos,
            SolicitacaoRepository solicitacoes,
            UsuarioRepository usuarios,
            EstadoSolicitacaoRepository estados
    ) {
        this.orcamentos = orcamentos;
        this.solicitacoes = solicitacoes;
        this.usuarios = usuarios;
        this.estados = estados;
    }

    @Transactional
    public OrcamentoResponse criar(OrcamentoRequest req) {
        // Evita duplicação
        if (orcamentos.existsBySolicitacaoId(req.solicitacaoId())) {
            throw new RuntimeException("Já existe um orçamento para esta solicitação.");
        }

        // Busca entidades relacionadas
        Solicitacao solicitacao = solicitacoes.findById(req.solicitacaoId())
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada."));

        Usuario funcionario = usuarios.findById(req.funcionarioId())
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));

        EstadoSolicitacao estadoOrcada = estados.findByNomeIgnoreCase("ORÇADA")
                .orElseThrow(() -> new RuntimeException("Estado 'ORÇADA' não encontrado."));

        Orcamento orc = Orcamento.builder()
                .solicitacao(solicitacao)
                .funcionario(funcionario)
                .valor(req.valor().longValue())
                .build();

        orcamentos.save(orc);

        solicitacao.setEstadoAtual(estadoOrcada);
        solicitacoes.save(solicitacao);

        return new OrcamentoResponse(
                orc.getId(),
                solicitacao.getId(),
                funcionario.getNome(),
                orc.getValor(),
                orc.getCriadoEm()
        );
    }

    @Transactional(readOnly = true)
    public OrcamentoResponse buscarPorSolicitacao(Long solicitacaoId) {
        Orcamento orc = orcamentos.findBySolicitacaoId(solicitacaoId)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado para esta solicitação."));

        return mapToResponse(orc);
    }

    @Transactional(readOnly = true)
    public OrcamentoResponse buscarPorId(Long id) {
        Orcamento orc = orcamentos.findById(id)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado."));
        return mapToResponse(orc);
    }

        private OrcamentoResponse mapToResponse(Orcamento orc) {
        return new OrcamentoResponse(
                orc.getId(),
                orc.getSolicitacao().getId(),
                orc.getFuncionario().getNome(),
                orc.getValor(),
                orc.getCriadoEm()
        );
        }
}
