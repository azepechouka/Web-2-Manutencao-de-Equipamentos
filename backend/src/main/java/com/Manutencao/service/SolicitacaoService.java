// src/main/java/com/Manutencao/services/SolicitacaoService.java
package com.Manutencao.services;

import com.Manutencao.api.dto.SolicitacaoCreateRequest;
import com.Manutencao.models.Categoria;
import com.Manutencao.models.EstadoSolicitacao;
import com.Manutencao.models.Solicitacao;
import com.Manutencao.models.Usuario;
import com.Manutencao.repositories.CategoriaRepository;
import com.Manutencao.repositories.EstadoSolicitacaoRepository;
import com.Manutencao.repositories.SolicitacaoRepository;
import com.Manutencao.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository repository;
    private final EstadoSolicitacaoRepository estadoRepo;
    private final UsuarioRepository usuarioRepo;
    private final CategoriaRepository categoriaRepo;

    public SolicitacaoService(
            SolicitacaoRepository repository,
            EstadoSolicitacaoRepository estadoRepo,
            UsuarioRepository usuarioRepo,
            CategoriaRepository categoriaRepo
    ) {
        this.repository = repository;
        this.estadoRepo = estadoRepo;
        this.usuarioRepo = usuarioRepo;
        this.categoriaRepo = categoriaRepo;
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

    public Optional<Solicitacao> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public List<Solicitacao> buscarPorCliente(Long clienteId) {
        return repository.findByCliente_Id(clienteId);
    }

    public boolean trocarEstado(Long solicitacaoId, String novoEstadoNome) {
        Optional<EstadoSolicitacao> estado = estadoRepo.findByNomeIgnoreCase(novoEstadoNome);
        if (estado.isEmpty()) return false;

        return repository.findById(solicitacaoId).map(solicitacao -> {
            solicitacao.setEstadoAtual(estado.get());
            repository.save(solicitacao);
            return true;
        }).orElse(false);
    }

    public Solicitacao salvar(Solicitacao s) {
        return repository.save(s);
    }
}
