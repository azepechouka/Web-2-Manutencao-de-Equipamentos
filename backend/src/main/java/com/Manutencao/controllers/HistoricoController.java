package com.Manutencao.controllers;

import com.Manutencao.dto.HistoricoRequest;
import com.Manutencao.dto.HistoricoResponse;
import com.Manutencao.service.HistoricoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/historico")
public class HistoricoController {

    private final HistoricoService service;

    public HistoricoController(HistoricoService service) {
        this.service = service;
    }

    @GetMapping("/solicitacao/{solicitacaoId}")
    public ResponseEntity<List<HistoricoResponse>> listarPorSolicitacao(@PathVariable Long solicitacaoId) {
        return ResponseEntity.ok(service.listarPorSolicitacao(solicitacaoId));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<HistoricoResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.listarPorUsuario(usuarioId));
    }

    @PostMapping
    public ResponseEntity<HistoricoResponse> criar(@RequestBody @Valid HistoricoRequest request) {
        HistoricoResponse created = service.criar(request);
        return ResponseEntity.created(URI.create("/api/historico/" + created.getId())).body(created);
    }
}
