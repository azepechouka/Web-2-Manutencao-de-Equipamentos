package com.Manutencao.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

import com.Manutencao.api.dto.ManutencaoRequest;
import com.Manutencao.api.dto.SolicitacaoCreateRequest;
import com.Manutencao.api.dto.SolicitacaoResponse;
import com.Manutencao.api.dto.ReceitaDia;
import com.Manutencao.api.dto.ReceitaPorCategoria;

import com.Manutencao.models.*;
import com.Manutencao.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@Transactional
public class SolicitacaoService {

    private final SolicitacaoRepository repository;
    private final EstadoSolicitacaoRepository estadoRepo;
    private final UsuarioRepository usuarioRepo;
    private final CategoriaRepository categoriaRepo;
    private final HistoricoSolicitacaoRepository historicoRepo;
    private final OrcamentoRepository orcamentoRepository;

    public SolicitacaoService(
        SolicitacaoRepository repository,
        EstadoSolicitacaoRepository estadoRepo,
        UsuarioRepository usuarioRepo,
        CategoriaRepository categoriaRepo,
        HistoricoSolicitacaoRepository historicoRepo,
        OrcamentoRepository orcamentoRepository
    ) {
        this.repository = repository;
        this.estadoRepo = estadoRepo;
        this.usuarioRepo = usuarioRepo;
        this.categoriaRepo = categoriaRepo;
        this.historicoRepo = historicoRepo;
        this.orcamentoRepository = orcamentoRepository;
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

    public List<Solicitacao> listarTodas(Long usuarioId) {
        return repository.findSolicitacoesByUsuario(usuarioId);
    }

    @Transactional
    public SolicitacaoResponse buscarPorId(Long id) {
        Solicitacao s = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada"));

        s.getCliente().getId();
        s.getCategoria().getNome();
        s.getEstadoAtual().getNome();

        String nomeFunc = null;

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

    @Transactional
    public boolean trocarEstado(Long solicitacaoId, String novoEstadoNome, Long usuarioId) {
        var estadoNovo = estadoRepo.findByNomeIgnoreCase(novoEstadoNome);
        if (estadoNovo.isEmpty()) return false;

        Solicitacao solicitacao = repository.findByIdComFetch(solicitacaoId);
        if (solicitacao == null) return false;

        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        EstadoSolicitacao estadoAnterior = solicitacao.getEstadoAtual();

        solicitacao.setEstadoAtual(estadoNovo.get());
        repository.save(solicitacao);

        HistoricoSolicitacao historico = HistoricoSolicitacao.builder()
                .solicitacao(solicitacao)
                .deEstado(estadoAnterior)
                .paraEstado(estadoNovo.get())
                .usuario(usuario)
                .observacao(
                        String.format(
                                "🔄 Estado alterado manualmente: %s → %s",
                                estadoAnterior != null ? estadoAnterior.getNome() : "Nenhum",
                                estadoNovo.get().getNome()
                        )
                )
                .criadoEm(Instant.now())
                .build();

        historicoRepo.save(historico);

        return true;
    }

    public Solicitacao salvar(Solicitacao s) {
        return repository.save(s);
    }

    @Transactional
    public boolean rejeitar(Long solicitacaoId, Long usuarioId, String motivoRejeicao) {
        var estadoRejeitada = estadoRepo.findByNomeIgnoreCase("Rejeitada");
        if (estadoRejeitada.isEmpty()) return false;

        Solicitacao solicitacao = repository.findByIdComFetch(solicitacaoId);
        if (solicitacao == null) return false;

        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        EstadoSolicitacao estadoAnterior = solicitacao.getEstadoAtual();

        solicitacao.setEstadoAtual(estadoRejeitada.get());
        repository.save(solicitacao);

        String observacao = String.format(
                "🔄 Estado alterado manualmente: %s → %s. Motivo: %s",
                estadoAnterior != null ? estadoAnterior.getNome() : "Nenhum",
                estadoRejeitada.get().getNome(),
                motivoRejeicao != null ? motivoRejeicao : "Não informado"
        );

        HistoricoSolicitacao historico = HistoricoSolicitacao.builder()
                .solicitacao(solicitacao)
                .deEstado(estadoAnterior)
                .paraEstado(estadoRejeitada.get())
                .usuario(usuario)
                .observacao(observacao)
                .criadoEm(Instant.now())
                .build();

        historicoRepo.save(historico);

        return true;
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
    public SolicitacaoResponse redirecionarManutencao(Long solicitacaoId, Long destinoFuncionarioId, String motivo, Long funcionarioRequisitanteId) {
        Solicitacao solicitacao = repository.findByIdComFetch(solicitacaoId);
        if (solicitacao == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada");
        }

        EstadoSolicitacao estadoRedirecionada = estadoRepo.findByNomeIgnoreCase("Redirecionada")
                .orElseThrow(() -> new IllegalStateException("Estado 'Redirecionada' não configurado."));

        Usuario destino = usuarioRepo.findById(destinoFuncionarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário destino não encontrado."));

        Usuario requisitante = usuarioRepo.findById(funcionarioRequisitanteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário requisitante não encontrado."));

        EstadoSolicitacao estadoAnterior = solicitacao.getEstadoAtual();

        solicitacao.setEstadoAtual(estadoRedirecionada);
        solicitacao.setFuncionarioDirecionado(destino);
        repository.save(solicitacao);

        String dataFormatada = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
                .withLocale(new Locale("pt", "BR"))
                .format(java.time.LocalDateTime.now());

        HistoricoSolicitacao hist = HistoricoSolicitacao.builder()
                .solicitacao(solicitacao)
                .deEstado(estadoAnterior)
                .paraEstado(estadoRedirecionada)
                .usuario(requisitante)
                .observacao(String.format(
                        "Redirecionado para %s em %s. Motivo: %s",
                        destino.getNome(), dataFormatada, motivo != null ? motivo : "—"
                ))
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

        EstadoSolicitacao estadoPaga = estadoRepo.findByNomeIgnoreCase("Paga")
                .orElseThrow(() -> new IllegalStateException("Estado 'Paga' não configurado."));

        EstadoSolicitacao estadoAnterior = solicitacao.getEstadoAtual();

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

    public List<ReceitaDia> gerarRelatorioReceita(String dataIni, String dataFim) {
        ZoneId zone = ZoneId.systemDefault();

        Instant ini = (dataIni == null)
                ? null
                : LocalDate.parse(dataIni).atStartOfDay(zone).toInstant();

        Instant fim = (dataFim == null)
                ? null
                : LocalDate.parse(dataFim).atTime(23, 59, 59).atZone(zone).toInstant();

        List<Solicitacao> solicitacoes = repository.buscarParaRelatorio(ini, fim);

        Map<String, List<Solicitacao>> agrupado =
                solicitacoes.stream().collect(Collectors.groupingBy(
                        s -> LocalDateTime.ofInstant(s.getCriadoEm(), zone)
                                        .toLocalDate()
                                        .toString()
                ));

        List<ReceitaDia> relatorio = new ArrayList<>();

        for (var entry : agrupado.entrySet()) {
            String data = entry.getKey();
            List<Solicitacao> lista = entry.getValue();

            double totalDia = lista.stream()
                                    .mapToDouble(solicitacao -> {
                                    Orcamento orcamento = orcamentoRepository.findBySolicitacaoId(solicitacao.getId()).orElse(null);
                                    return orcamento != null ? orcamento.getValor() : 0;
                                    })
                                    .sum();

            relatorio.add(
                    new ReceitaDia(
                            data,
                            totalDia,
                            lista.size(),
                            lista.stream().map(SolicitacaoResponse::from).toList()
                    )
            );
        }

        relatorio.sort(Comparator.comparing(ReceitaDia::data));

        return relatorio;
    }

    public List<ReceitaPorCategoria> gerarRelatorioReceitaPorCategoria() {
        List<SolicitacaoRepository.ReceitaCategoriaProjection> dadosAgregados = 
            repository.findReceitaPorCategoria();
        
        List<Solicitacao> todasSolicitacoes = repository.findByEstadoAtualNomeIn(
            List.of("Finalizada", "Paga")
        );
        
        Map<String, List<Solicitacao>> solicitacoesPorCategoria = todasSolicitacoes.stream()
                .collect(Collectors.groupingBy(s -> s.getCategoria().getNome()));

        return dadosAgregados.stream()
                .map(dado -> {
                    String categoriaNome = dado.getCategoriaNome();
                    List<Solicitacao> solicitacoes = solicitacoesPorCategoria
                        .getOrDefault(categoriaNome, new ArrayList<>());
                    
                    List<SolicitacaoResponse> solicitacoesResponse = solicitacoes.stream()
                            .map(SolicitacaoResponse::from)
                            .collect(Collectors.toList());

                    Double totalReceita = dado.getTotalReceita() != null ? 
                        dado.getTotalReceita().doubleValue() : 0.0;
                    
                    Integer quantidadeServicos = dado.getQuantidadeSolicitacoes() != null ? 
                        dado.getQuantidadeSolicitacoes().intValue() : 0;

                    return new ReceitaPorCategoria(
                            categoriaNome,
                            totalReceita,
                            quantidadeServicos,
                            solicitacoesResponse
                    );
                })
                .sorted(Comparator.comparing(ReceitaPorCategoria::categoriaNome))
                .collect(Collectors.toList());
    }
}