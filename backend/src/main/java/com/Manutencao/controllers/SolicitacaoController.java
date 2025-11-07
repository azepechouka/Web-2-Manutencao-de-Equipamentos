package com.Manutencao.controllers;

import com.Manutencao.api.dto.SolicitacaoCreateRequest;
import com.Manutencao.models.Solicitacao;
import com.Manutencao.services.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacao")
@CrossOrigin(origins = "*")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    public SolicitacaoController(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    // Criar usando clienteId
    @PostMapping
    public ResponseEntity<Solicitacao> criar(@RequestBody @Valid SolicitacaoCreateRequest req) {
        Solicitacao criada = solicitacaoService.criar(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    @GetMapping
    public ResponseEntity<List<Solicitacao>> listarTodas() {
        return ResponseEntity.ok(solicitacaoService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitacao> buscarPorId(@PathVariable Long id) {
        return solicitacaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Solicitacao>> buscarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(solicitacaoService.buscarPorCliente(clienteId));
    }

    @PostMapping("/{id}/aprovar")
    public ResponseEntity<Boolean> aprovar(@PathVariable Long id) {
        boolean ok = solicitacaoService.trocarEstado(id, "APROVADA");
        return ResponseEntity.ok(ok);
    }

    @PostMapping("/{id}/rejeitar")
    public ResponseEntity<Boolean> rejeitar(@PathVariable Long id, @RequestBody MotivoRejeicao motivo) {
        boolean ok = solicitacaoService.trocarEstado(id, "REJEITADA");
        return ResponseEntity.ok(ok);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        solicitacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    public record MotivoRejeicao(String motivo) {}
}
