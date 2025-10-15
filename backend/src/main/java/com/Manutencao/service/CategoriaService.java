package com.Manutencao.services;

import com.Manutencao.dto.CategoriaRequest;
import com.Manutencao.dto.CategoriaResponse;
import com.Manutencao.mappers.CategoriaMapper;
import com.Manutencao.models.Categoria;
import com.Manutencao.repositories.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class CategoriaService {

    private final CategoriaRepository repo;

    public CategoriaService(CategoriaRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarTodas() {
        return repo.findAll()
                .stream()
                .map(CategoriaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoriaResponse buscarPorId(Long id) {
        Categoria c = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Categoria não encontrada"));
        return CategoriaMapper.toResponse(c);
    }

    @Transactional
    public CategoriaResponse criar(CategoriaRequest req) {
        if (repo.existsByNomeIgnoreCase(req.getNome())) {
            throw new ResponseStatusException(CONFLICT, "Já existe categoria com este nome");
        }
        Categoria entity = CategoriaMapper.toEntity(req);
        entity = repo.save(entity);
        return CategoriaMapper.toResponse(entity);
    }

    @Transactional
    public CategoriaResponse atualizar(Long id, CategoriaRequest req) {
        Categoria entity = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Categoria não encontrada"));

        if (repo.existsByNomeIgnoreCaseAndIdNot(req.getNome(), id)) {
            throw new ResponseStatusException(CONFLICT, "Já existe categoria com este nome");
        }

        CategoriaMapper.copyToEntity(req, entity);
        entity = repo.save(entity);
        return CategoriaMapper.toResponse(entity);
    }
}
