package com.Manutencao.controllers;

import com.Manutencao.dto.ManutencaoRequest;
import com.Manutencao.dto.ManutencaoResponse;
import com.Manutencao.service.ManutencaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/manutencoes")
public class ManutencaoController {

    private final ManutencaoService service;

    public ManutencaoController(ManutencaoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ManutencaoResponse>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ManutencaoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/solicitacao/{solicitacaoId}")
    public ResponseEntity<List<ManutencaoResponse>> listarPorSolicitacao(@PathVariable Long solicitacaoId) {
        return ResponseEntity.ok(service.listarPorSolicitacao(solicitacaoId));
    }

    @GetMapping("/funcionario/{funcionarioId}")
    public ResponseEntity<List<ManutencaoResponse>> listarPorFuncionario(@PathVariable Long funcionarioId) {
        return ResponseEntity.ok(service.listarPorFuncionario(funcionarioId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ManutencaoResponse>> listarPorStatus(@PathVariable String status) {
        return ResponseEntity.ok(service.listarPorStatus(status));
    }

    @PostMapping
    public ResponseEntity<ManutencaoResponse> criar(@RequestBody @Valid ManutencaoRequest request) {
        ManutencaoResponse created = service.criar(request);
        return ResponseEntity.created(URI.create("/api/manutencoes/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ManutencaoResponse> atualizar(@PathVariable Long id, 
                                                        @RequestBody @Valid ManutencaoRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @PostMapping("/{id}/concluir")
    public ResponseEntity<Void> concluir(@PathVariable Long id) {
        service.concluir(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/redirecionar")
    public ResponseEntity<Void> redirecionar(@PathVariable Long id, 
                                            @RequestBody Long funcionarioDestinoId) {
        service.redirecionar(id, funcionarioDestinoId);
        return ResponseEntity.ok().build();
    }
}