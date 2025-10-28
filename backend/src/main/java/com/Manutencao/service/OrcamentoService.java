package com.Manutencao.service;

import com.Manutencao.dto.OrcamentoRequest;
import com.Manutencao.dto.OrcamentoResponse;
import com.Manutencao.mappers.OrcamentoMapper;
import com.Manutencao.models.Orcamento;
import com.Manutencao.models.Usuario;
import com.Manutencao.repositories.OrcamentoRepository;
import com.Manutencao.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class OrcamentoService {

    private final OrcamentoRepository repo;
    private final UsuarioRepository usuarioRepo;

    public OrcamentoService(OrcamentoRepository repo, UsuarioRepository usuarioRepo) {
        this.repo = repo;
        this.usuarioRepo = usuarioRepo;
    }

    @Transactional(readOnly = true)
    public List<OrcamentoResponse> listarTodos() {
        return repo.findAll().stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrcamentoResponse buscarPorId(Long id) {
        Orcamento orcamento = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Orçamento não encontrado"));
        return toResponseWithDetails(orcamento);
    }

    @Transactional(readOnly = true)
    public List<OrcamentoResponse> listarPorSolicitacao(Long solicitacaoId) {
        return repo.findBySolicitacaoIdOrderByCriadoEmDesc(solicitacaoId).stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrcamentoResponse> listarPorPeriodo(LocalDateTime dataInicio, LocalDateTime dataFim) {
        return repo.findByCriadoEmBetweenOrderByCriadoEmDesc(dataInicio, dataFim).stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrcamentoResponse criar(OrcamentoRequest request) {
        Orcamento entity = OrcamentoMapper.toEntity(request);
        entity = repo.save(entity);
        return toResponseWithDetails(entity);
    }

    @Transactional
    public OrcamentoResponse atualizar(Long id, OrcamentoRequest request) {
        Orcamento entity = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Orçamento não encontrado"));
        
        OrcamentoMapper.copyToEntity(request, entity);
        entity = repo.save(entity);
        return toResponseWithDetails(entity);
    }

    @Transactional
    public void aprovar(Long id) {
        Orcamento orcamento = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Orçamento não encontrado"));
        
        // Lógica de aprovação seria implementada aqui
        // Por exemplo, mudar status da solicitação relacionada
    }

    @Transactional
    public void rejeitar(Long id, String motivoRejeicao) {
        Orcamento orcamento = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Orçamento não encontrado"));
        
        // Lógica de rejeição seria implementada aqui
        // Por exemplo, mudar status da solicitação relacionada
    }

    private OrcamentoResponse toResponseWithDetails(Orcamento orcamento) {
        Usuario funcionario = usuarioRepo.findById(orcamento.getFuncionarioId()).orElse(null);
        return OrcamentoMapper.toResponseWithDetails(orcamento, funcionario);
    }
}
