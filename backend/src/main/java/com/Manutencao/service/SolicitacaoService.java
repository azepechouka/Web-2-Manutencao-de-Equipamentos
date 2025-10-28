package com.Manutencao.service;

import com.Manutencao.dto.SolicitacaoRequest;
import com.Manutencao.dto.SolicitacaoResponse;
import com.Manutencao.mappers.SolicitacaoMapper;
import com.Manutencao.models.Solicitacao;
import com.Manutencao.models.EstadoSolicitacao;
import com.Manutencao.models.Usuario;
import com.Manutencao.models.Categoria;
import com.Manutencao.repositories.SolicitacaoRepository;
import com.Manutencao.repositories.UsuarioRepository;
import com.Manutencao.repositories.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository repo;
    private final UsuarioRepository usuarioRepo;
    private final CategoriaRepository categoriaRepo;

    public SolicitacaoService(SolicitacaoRepository repo, UsuarioRepository usuarioRepo, CategoriaRepository categoriaRepo) {
        this.repo = repo;
        this.usuarioRepo = usuarioRepo;
        this.categoriaRepo = categoriaRepo;
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> listarTodas() {
        return repo.findAll().stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SolicitacaoResponse buscarPorId(Long id) {
        Solicitacao solicitacao = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Solicitação não encontrada"));
        return toResponseWithDetails(solicitacao);
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> listarPorCliente(Long clienteId) {
        return repo.findByClienteIdOrderByCriadoEmDesc(clienteId).stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> listarParaFuncionarioEmAberto() {
        // Status em aberto: CRIADA (1)
        List<Long> statusAbertos = List.of(1L);
        return repo.findByStatusAtualIdInOrderByCriadoEmDesc(statusAbertos).stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional
    public SolicitacaoResponse criar(SolicitacaoRequest request) {
        Solicitacao entity = SolicitacaoMapper.toEntity(request);
        entity = repo.save(entity);
        return toResponseWithDetails(entity);
    }

    @Transactional
    public SolicitacaoResponse atualizar(Long id, SolicitacaoRequest request) {
        Solicitacao entity = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Solicitação não encontrada"));
        
        SolicitacaoMapper.copyToEntity(request, entity);
        entity = repo.save(entity);
        return toResponseWithDetails(entity);
    }

    @Transactional
    public void aprovarOrcamento(Long id) {
        Solicitacao solicitacao = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Solicitação não encontrada"));
        
        // Muda status para APROVADA (3)
        solicitacao.setStatusAtualId(3L);
        repo.save(solicitacao);
    }

    @Transactional
    public void rejeitarOrcamento(Long id, String motivoRejeicao) {
        Solicitacao solicitacao = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Solicitação não encontrada"));
        
        // Muda status para REJEITADA (4)
        solicitacao.setStatusAtualId(4L);
        repo.save(solicitacao);
    }

    @Transactional
    public void finalizarSolicitacao(Long id) {
        Solicitacao solicitacao = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Solicitação não encontrada"));
        
        // Muda status para FINALIZADA (6)
        solicitacao.setStatusAtualId(6L);
        repo.save(solicitacao);
    }

    private SolicitacaoResponse toResponseWithDetails(Solicitacao solicitacao) {
        Usuario cliente = usuarioRepo.findById(solicitacao.getClienteId()).orElse(null);
        Categoria categoria = categoriaRepo.findById(solicitacao.getCategoriaEquipamentoId()).orElse(null);
        
        // Buscar status atual (simplificado - em produção seria uma tabela separada)
        EstadoSolicitacao status = getStatusById(solicitacao.getStatusAtualId());
        
        return SolicitacaoMapper.toResponseWithDetails(solicitacao, cliente, categoria, status);
    }

    private EstadoSolicitacao getStatusById(Long statusId) {
        // Mapeamento simplificado - em produção seria uma consulta ao banco
        return switch (statusId.intValue()) {
            case 1 -> new EstadoSolicitacao(1L, "CRIADA", "Criada");
            case 2 -> new EstadoSolicitacao(2L, "ORCADA", "Orçada");
            case 3 -> new EstadoSolicitacao(3L, "APROVADA", "Aprovada");
            case 4 -> new EstadoSolicitacao(4L, "REJEITADA", "Rejeitada");
            case 5 -> new EstadoSolicitacao(5L, "EM_EXEC", "Em execução");
            case 6 -> new EstadoSolicitacao(6L, "CONCLUIDA", "Concluída");
            default -> new EstadoSolicitacao(statusId, "DESCONHECIDO", "Desconhecido");
        };
    }
}
