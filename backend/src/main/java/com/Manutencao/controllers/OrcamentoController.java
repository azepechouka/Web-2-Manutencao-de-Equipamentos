package com.Manutencao.api.controller;

import com.Manutencao.api.dto.OrcamentoRequest;
import com.Manutencao.api.dto.OrcamentoResponse;
import com.Manutencao.services.OrcamentoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orcamento")
public class OrcamentoController {

    private final OrcamentoService orcamentoService;

    public OrcamentoController(OrcamentoService orcamentoService) {
        this.orcamentoService = orcamentoService;
    }

    @PostMapping
    public ResponseEntity<OrcamentoResponse> criar(@RequestBody OrcamentoRequest request) {
        OrcamentoResponse orc = orcamentoService.criar(request);
        return ResponseEntity.ok(orc);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrcamentoResponse> buscarPorId(@PathVariable Long id) {
        OrcamentoResponse orc = orcamentoService.buscarPorId(id);
        return ResponseEntity.ok(orc);
    }

    @GetMapping("/solicitacao/{solicitacaoId}")
    public ResponseEntity<OrcamentoResponse> buscarPorSolicitacao(@PathVariable Long solicitacaoId) {
        OrcamentoResponse orc = orcamentoService.buscarPorSolicitacao(solicitacaoId);
        return ResponseEntity.ok(orc);
    }
}
