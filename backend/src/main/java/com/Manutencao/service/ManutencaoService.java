package com.Manutencao.service;

import com.Manutencao.dto.ManutencaoRequest;
import com.Manutencao.dto.ManutencaoResponse;
import com.Manutencao.models.Manutencao;
import com.Manutencao.models.Usuario;
import com.Manutencao.repositories.ManutencaoRepository;
import com.Manutencao.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class ManutencaoService {

    private final ManutencaoRepository repo;
    private final UsuarioRepository usuarioRepo;

    public ManutencaoService(ManutencaoRepository repo, UsuarioRepository usuarioRepo) {
        this.repo = repo;
        this.usuarioRepo = usuarioRepo;
    }

    @Transactional(readOnly = true)
    public List<ManutencaoResponse> listarTodas() {
        return repo.findAll().stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ManutencaoResponse buscarPorId(Long id) {
        Manutencao manutencao = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Manutenção não encontrada"));
        return toResponseWithDetails(manutencao);
    }

    @Transactional(readOnly = true)
    public List<ManutencaoResponse> listarPorSolicitacao(Long solicitacaoId) {
        return repo.findBySolicitacaoIdOrderByCriadoEmDesc(solicitacaoId).stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ManutencaoResponse> listarPorFuncionario(Long funcionarioId) {
        return repo.findByFuncionarioIdOrderByCriadoEmDesc(funcionarioId).stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ManutencaoResponse> listarPorStatus(String status) {
        return repo.findByStatusOrderByCriadoEmDesc(status).stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional
    public ManutencaoResponse criar(ManutencaoRequest request) {
        Manutencao entity = new Manutencao();
        entity.setSolicitacaoId(request.getSolicitacaoId());
        entity.setFuncionarioId(request.getFuncionarioId());
        entity.setDescricaoServico(request.getDescricaoServico());
        entity.setObservacoes(request.getObservacoes());
        entity.setStatus("EM_ANDAMENTO");
        entity.setCriadoEm(LocalDateTime.now());
        
        entity = repo.save(entity);
        return toResponseWithDetails(entity);
    }

    @Transactional
    public ManutencaoResponse atualizar(Long id, ManutencaoRequest request) {
        Manutencao entity = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Manutenção não encontrada"));
        
        entity.setDescricaoServico(request.getDescricaoServico());
        entity.setObservacoes(request.getObservacoes());
        entity.setAtualizadoEm(LocalDateTime.now());
        
        entity = repo.save(entity);
        return toResponseWithDetails(entity);
    }

    @Transactional
    public void concluir(Long id) {
        Manutencao manutencao = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Manutenção não encontrada"));
        
        manutencao.setStatus("CONCLUIDA");
        manutencao.setAtualizadoEm(LocalDateTime.now());
        repo.save(manutencao);
    }

    @Transactional
    public void redirecionar(Long id, Long funcionarioDestinoId) {
        Manutencao manutencao = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Manutenção não encontrada"));
        
        manutencao.setFuncionarioId(funcionarioDestinoId);
        manutencao.setStatus("REDIRECIONADA");
        manutencao.setAtualizadoEm(LocalDateTime.now());
        repo.save(manutencao);
    }

    private ManutencaoResponse toResponseWithDetails(Manutencao manutencao) {
        Usuario funcionario = usuarioRepo.findById(manutencao.getFuncionarioId()).orElse(null);
        
        ManutencaoResponse response = new ManutencaoResponse();
        response.setId(manutencao.getId());
        response.setSolicitacaoId(manutencao.getSolicitacaoId());
        response.setFuncionarioId(manutencao.getFuncionarioId());
        response.setFuncionarioNome(funcionario != null ? funcionario.getNome() : null);
        response.setDescricaoServico(manutencao.getDescricaoServico());
        response.setObservacoes(manutencao.getObservacoes());
        response.setStatus(manutencao.getStatus());
        response.setCriadoEm(manutencao.getCriadoEm());
        response.setAtualizadoEm(manutencao.getAtualizadoEm());
        
        return response;
    }
}
