package com.Manutencao.services;

import com.Manutencao.api.dto.SolicitacaoCreateRequest;
import com.Manutencao.api.dto.SolicitacaoResponse;
import com.Manutencao.models.*;
import com.Manutencao.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository repository;
    private final EstadoSolicitacaoRepository estadoRepo;
    private final UsuarioRepository usuarioRepo;
    private final CategoriaRepository categoriaRepo;
    private final HistoricoSolicitacaoRepository historicoRepo; // ✅ adicionado

    public SolicitacaoService(
            SolicitacaoRepository repository,
            EstadoSolicitacaoRepository estadoRepo,
            UsuarioRepository usuarioRepo,
            CategoriaRepository categoriaRepo,
            HistoricoSolicitacaoRepository historicoRepo // ✅ adicionado no construtor
    ) {
        this.repository = repository;
        this.estadoRepo = estadoRepo;
        this.usuarioRepo = usuarioRepo;
        this.categoriaRepo = categoriaRepo;
        this.historicoRepo = historicoRepo; // ✅ inicializado
    }

    public Solicitacao criar(SolicitacaoCreateRequest req) {
        Usuario cliente = usuarioRepo.findById(req.clienteId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente inexistente: " + req.clienteId()));

        Categoria categoria = categoriaRepo.findById(req.categoriaId())
                .orElseThrow(() -> new IllegalArgumentException("Categoria inexistente: " + req.categoriaId()));

        EstadoSolicitacao estadoInicial = estadoRepo.findByNomeIgnoreCase("ABERTA")
                .orElseThrow(() -> new IllegalStateException("Estado 'ABERTA' não configurado."));

        Solicitacao nova = Solicitacao.builder()
                .id(null)
                .cliente(cliente)
                .categoria(categoria)
                .descricaoEquipamento(req.descricaoEquipamento())
                .descricaoDefeito(req.descricaoDefeito())
                .estadoAtual(estadoInicial)
                .build();

        return repository.save(nova);
    }

    public List<Solicitacao> listarTodas() {
        return repository.findAll();
    }

    @Transactional
    public SolicitacaoResponse buscarPorId(Long id) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada"));

        s.getCliente().getId();
        s.getCategoria().getNome();
        s.getEstadoAtual().getNome();

        return SolicitacaoResponse.from(s);
    }

    public List<Solicitacao> buscarPorCliente(Long clienteId) {
        return repository.findByCliente_IdWithFetch(clienteId);
    }

    public boolean trocarEstado(Long solicitacaoId, String novoEstadoNome) {
        var estado = estadoRepo.findByNomeIgnoreCase(novoEstadoNome);
        if (estado.isEmpty()) return false;

        Solicitacao solicitacao = repository.findByIdComFetch(solicitacaoId);
        if (solicitacao == null) return false;

        solicitacao.setEstadoAtual(estado.get());
        repository.save(solicitacao);
        return true;
    }

    public Solicitacao salvar(Solicitacao s) {
        return repository.save(s);
    }

    @Transactional
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada");
        }
        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Solicitação vinculada a outros registros e não pode ser removida"
            );
        }
    }

    @Transactional
    public List<SolicitacaoResponse> listarEmAberto() {
        return repository.findByEstadoAtual_NomeIgnoreCase("Aberta")
                .stream()
                .map(SolicitacaoResponse::from)
                .toList();
    }

    @Transactional
    public boolean resgatarSolicitacao(Long solicitacaoId) {
        var solicitacaoOpt = repository.findById(solicitacaoId);
        if (solicitacaoOpt.isEmpty()) return false;

        var solicitacao = solicitacaoOpt.get();

        if (!"Rejeitada".equalsIgnoreCase(solicitacao.getEstadoAtual().getNome())) {
            return false;
        }

        var estadoAprovada = estadoRepo.findByNomeIgnoreCase("Aprovada")
                .orElseThrow(() -> new IllegalStateException("Estado 'Aprovada' não encontrado no banco."));

        var estadoAnterior = solicitacao.getEstadoAtual();

        solicitacao.setEstadoAtual(estadoAprovada);
        repository.save(solicitacao);

        var historico = HistoricoSolicitacao.builder()
                .solicitacao(solicitacao)
                .deEstado(estadoAnterior)
                .paraEstado(estadoAprovada)
                .observacao("Solicitação resgatada manualmente e reativada em " + Instant.now())
                .criadoEm(Instant.now())
                .build();

        historicoRepo.save(historico);

        return true;
    }
}
