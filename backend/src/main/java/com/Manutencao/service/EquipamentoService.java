package com.Manutencao.service;

import com.Manutencao.dto.EquipamentoRequest;
import com.Manutencao.dto.EquipamentoResponse;
import com.Manutencao.models.Equipamento;
import com.Manutencao.models.Usuario;
import com.Manutencao.models.Categoria;
import com.Manutencao.repositories.EquipamentoRepository;
import com.Manutencao.repositories.UsuarioRepository;
import com.Manutencao.repositories.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class EquipamentoService {

    private final EquipamentoRepository repo;
    private final UsuarioRepository usuarioRepo;
    private final CategoriaRepository categoriaRepo;

    public EquipamentoService(EquipamentoRepository repo, UsuarioRepository usuarioRepo, CategoriaRepository categoriaRepo) {
        this.repo = repo;
        this.usuarioRepo = usuarioRepo;
        this.categoriaRepo = categoriaRepo;
    }

    @Transactional(readOnly = true)
    public List<EquipamentoResponse> listarTodos() {
        return repo.findAll().stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EquipamentoResponse buscarPorId(Long id) {
        Equipamento equipamento = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Equipamento não encontrado"));
        return toResponseWithDetails(equipamento);
    }

    @Transactional(readOnly = true)
    public List<EquipamentoResponse> listarPorCliente(Long clienteId) {
        return repo.findByClienteIdOrderByCriadoEmDesc(clienteId).stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EquipamentoResponse> listarPorCategoria(Long categoriaId) {
        return repo.findByCategoriaIdOrderByCriadoEmDesc(categoriaId).stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EquipamentoResponse> buscarPorNumeroSerie(String numeroSerie) {
        return repo.findByNumeroSerie(numeroSerie).stream()
                .map(this::toResponseWithDetails)
                .collect(Collectors.toList());
    }

    @Transactional
    public EquipamentoResponse criar(EquipamentoRequest request) {
        Equipamento entity = new Equipamento();
        entity.setClienteId(request.getClienteId());
        entity.setDescricao(request.getDescricao());
        entity.setModelo(request.getModelo());
        entity.setNumeroSerie(request.getNumeroSerie());
        entity.setCategoriaId(request.getCategoriaId());
        entity.setCriadoEm(LocalDateTime.now());
        
        entity = repo.save(entity);
        return toResponseWithDetails(entity);
    }

    @Transactional
    public EquipamentoResponse atualizar(Long id, EquipamentoRequest request) {
        Equipamento entity = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Equipamento não encontrado"));
        
        entity.setDescricao(request.getDescricao());
        entity.setModelo(request.getModelo());
        entity.setNumeroSerie(request.getNumeroSerie());
        entity.setCategoriaId(request.getCategoriaId());
        
        entity = repo.save(entity);
        return toResponseWithDetails(entity);
    }

    @Transactional
    public void deletar(Long id) {
        Equipamento equipamento = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Equipamento não encontrado"));
        
        repo.delete(equipamento);
    }

    private EquipamentoResponse toResponseWithDetails(Equipamento equipamento) {
        Usuario cliente = usuarioRepo.findById(equipamento.getClienteId()).orElse(null);
        Categoria categoria = categoriaRepo.findById(equipamento.getCategoriaId()).orElse(null);
        
        EquipamentoResponse response = new EquipamentoResponse();
        response.setId(equipamento.getId());
        response.setClienteId(equipamento.getClienteId());
        response.setClienteNome(cliente != null ? cliente.getNome() : null);
        response.setDescricao(equipamento.getDescricao());
        response.setModelo(equipamento.getModelo());
        response.setNumeroSerie(equipamento.getNumeroSerie());
        response.setCategoriaId(equipamento.getCategoriaId());
        response.setCategoriaNome(categoria != null ? categoria.getNome() : null);
        response.setCriadoEm(equipamento.getCriadoEm());
        
        return response;
    }
}
