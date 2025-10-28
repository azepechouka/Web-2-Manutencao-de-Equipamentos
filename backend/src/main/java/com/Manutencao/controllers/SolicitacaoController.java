package com.Manutencao.controllers;

import com.Manutencao.dto.SolicitacaoRequest;
import com.Manutencao.dto.SolicitacaoResponse;
import com.Manutencao.service.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService service;

    public SolicitacaoController(SolicitacaoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SolicitacaoResponse>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(service.listarPorCliente(clienteId));
    }

    @GetMapping("/funcionario/abertas")
    public ResponseEntity<List<SolicitacaoResponse>> listarParaFuncionarioEmAberto() {
        return ResponseEntity.ok(service.listarParaFuncionarioEmAberto());
    }

    @PostMapping
    public ResponseEntity<SolicitacaoResponse> criar(@RequestBody @Valid SolicitacaoRequest request) {
        SolicitacaoResponse created = service.criar(request);
        return ResponseEntity.created(URI.create("/api/solicitacoes/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolicitacaoResponse> atualizar(@PathVariable Long id, 
                                                        @RequestBody @Valid SolicitacaoRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @PostMapping("/{id}/aprovar-orcamento")
    public ResponseEntity<Void> aprovarOrcamento(@PathVariable Long id) {
        service.aprovarOrcamento(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/rejeitar-orcamento")
    public ResponseEntity<Void> rejeitarOrcamento(@PathVariable Long id, 
                                                  @RequestBody String motivoRejeicao) {
        service.rejeitarOrcamento(id, motivoRejeicao);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/finalizar")
    public ResponseEntity<Void> finalizarSolicitacao(@PathVariable Long id) {
        service.finalizarSolicitacao(id);
        return ResponseEntity.ok().build();
    }
}
