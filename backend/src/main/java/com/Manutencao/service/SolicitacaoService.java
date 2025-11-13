package com.Manutencao.services;
import com.Manutencao.api.dto.ManutencaoRequest;
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
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository repository;
    private final EstadoSolicitacaoRepository estadoRepo;
    private final UsuarioRepository usuarioRepo;
    private final CategoriaRepository categoriaRepo;
    private final HistoricoSolicitacaoRepository historicoRepo;

    public SolicitacaoService(
            SolicitacaoRepository repository,
            EstadoSolicitacaoRepository estadoRepo,
            UsuarioRepository usuarioRepo,
            CategoriaRepository categoriaRepo,
            HistoricoSolicitacaoRepository historicoRepo 
    ) {
        this.repository = repository;
        this.estadoRepo = estadoRepo;
        this.usuarioRepo = usuarioRepo;
        this.categoriaRepo = categoriaRepo;
        this.historicoRepo = historicoRepo;
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
        return repository.findAllWithFetch();
    }

    @Transactional
    public SolicitacaoResponse buscarPorId(Long id) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada"));

        s.getCliente().getId();
        s.getCategoria().getNome();
        s.getEstadoAtual().getNome();

        String nomeFunc = null;

        // Se a solicitação estiver no estado "Arrumada", buscamos  funcionário do histórico
        if ("Arrumada".equalsIgnoreCase(s.getEstadoAtual().getNome())) {
            var historicoArrumada = historicoRepo
                .findTopBySolicitacaoIdAndParaEstadoNomeIgnoreCaseOrderByCriadoEmDesc(s.getId(), "Arrumada");


            if (historicoArrumada != null && historicoArrumada.getUsuario() != null) {
                nomeFunc = historicoArrumada.getUsuario().getNome();
            }
        }

        return SolicitacaoResponse.from(s, nomeFunc);
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

    @Transactional
    public SolicitacaoResponse efetuarManutencao(ManutencaoRequest req) {
        Solicitacao solicitacao = repository.findByIdComFetch(req.solicitacaoId());
        if (solicitacao == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada.");
        }

        EstadoSolicitacao estadoArrumada = estadoRepo.findByNomeIgnoreCase("Arrumada")
                .orElseThrow(() -> new IllegalStateException("Estado 'Arrumada' não configurado."));

        Usuario funcionario = usuarioRepo.findById(req.funcionarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));

        EstadoSolicitacao estadoAnterior = solicitacao.getEstadoAtual();

        solicitacao.setDescricaoManutencao(req.descricaoManutencao());
        solicitacao.setOrientacoesCliente(req.orientacoesCliente());
        solicitacao.setEstadoAtual(estadoArrumada);
        repository.save(solicitacao);

        HistoricoSolicitacao historico = HistoricoSolicitacao.builder()
                .solicitacao(solicitacao)
                .deEstado(estadoAnterior)
                .paraEstado(estadoArrumada)
                .usuario(funcionario)
                .observacao(
                        String.format(
                                "🛠️ Manutenção concluída.\nDescrição: %s\nOrientações: %s",
                                req.descricaoManutencao(), req.orientacoesCliente()
                        )
                )
                .criadoEm(Instant.now())
                .build();

        historicoRepo.save(historico);

        return SolicitacaoResponse.from(solicitacao);
    }



    @Transactional
    public SolicitacaoResponse redirecionarManutencao(Long solicitacaoId, Long destinoFuncionarioId, String motivo) {
        Solicitacao solicitacao = repository.findByIdComFetch(solicitacaoId);
        if (solicitacao == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada");
        }

        EstadoSolicitacao estadoRedirecionada = estadoRepo.findByNomeIgnoreCase("Redirecionada")
                .orElseThrow(() -> new IllegalStateException("Estado 'Redirecionada' não configurado."));

        var destino = usuarioRepo.findById(destinoFuncionarioId)
                .orElseThrow(() -> new IllegalArgumentException("Funcionário destino não encontrado: " + destinoFuncionarioId));

        var estadoAnterior = solicitacao.getEstadoAtual();

        solicitacao.setEstadoAtual(estadoRedirecionada);
        repository.save(solicitacao);

        HistoricoSolicitacao hist = HistoricoSolicitacao.builder()
                .solicitacao(solicitacao)
                .deEstado(estadoAnterior)
                .paraEstado(estadoRedirecionada)
                .usuario(destino)
                .observacao("Redirecionado para " + destino.getNome() + ". Motivo: " + motivo)
                .criadoEm(Instant.now())
                .build();

        historicoRepo.save(hist);

        return SolicitacaoResponse.from(solicitacao);
    }


    @Transactional
    public boolean pagarSolicitacao(Long solicitacaoId) {
        Solicitacao solicitacao = repository.findByIdComFetch(solicitacaoId);
        if (solicitacao == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada.");
        }

        // Estado "Paga"
        EstadoSolicitacao estadoPaga = estadoRepo.findByNomeIgnoreCase("Paga")
                .orElseThrow(() -> new IllegalStateException("Estado 'Paga' não configurado."));

        // Guarda o estado anterior
        EstadoSolicitacao estadoAnterior = solicitacao.getEstadoAtual();

        // Atualiza o estado
        solicitacao.setEstadoAtual(estadoPaga);
        repository.save(solicitacao);

        Usuario cliente = solicitacao.getCliente();

        String dataFormatada = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
                .withLocale(new Locale("pt", "BR"))
                .format(Instant.now().atZone(java.time.ZoneId.systemDefault()));

        HistoricoSolicitacao historico = HistoricoSolicitacao.builder()
                .solicitacao(solicitacao)
                .deEstado(estadoAnterior)
                .paraEstado(estadoPaga)
                .usuario(cliente) 
                .observacao(String.format(" Solicitação paga por %s em %s", cliente.getNome(), dataFormatada))
                .criadoEm(Instant.now())
                .build();

        historicoRepo.save(historico);

        return true;
    }
}
