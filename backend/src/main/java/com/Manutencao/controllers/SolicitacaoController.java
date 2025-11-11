package com.Manutencao.controllers;

import com.Manutencao.api.dto.SolicitacaoCreateRequest;
import com.Manutencao.models.Solicitacao;
import com.Manutencao.services.SolicitacaoService;
import com.Manutencao.api.dto.HistoricoStatusResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Manutencao.api.dto.SolicitacaoResponse;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacao")
@CrossOrigin(origins = "*")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    public SolicitacaoController(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping
    public ResponseEntity<SolicitacaoResponse> criar(@RequestBody @Valid SolicitacaoCreateRequest req) {
        Solicitacao s = solicitacaoService.criar(req);
        return ResponseEntity.ok(SolicitacaoResponse.from(s));
    }

    @GetMapping
    public ResponseEntity<List<SolicitacaoResponse>> listarTodas() {
        List<SolicitacaoResponse> lista = solicitacaoService.listarTodas()
            .stream().map(SolicitacaoResponse::from).toList();
        return ResponseEntity.ok(lista);
    }


    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponse> buscarPorId(@PathVariable Long id) {
        Solicitacao s = solicitacaoService.buscarPorId(id);
        if (s == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(SolicitacaoResponse.from(s));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<SolicitacaoResponse>> buscarPorCliente(@PathVariable Long clienteId) {
        var lista = solicitacaoService.buscarPorCliente(clienteId)
            .stream()
            .map(SolicitacaoResponse::from)
            .toList();

        return ResponseEntity.ok(lista);
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
