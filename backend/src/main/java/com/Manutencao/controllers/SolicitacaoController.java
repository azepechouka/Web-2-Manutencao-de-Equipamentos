package com.Manutencao.controllers;

import com.Manutencao.api.dto.SolicitacaoCreateRequest;
import com.Manutencao.models.Solicitacao;
import com.Manutencao.services.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Manutencao.api.dto.SolicitacaoResponse;
import com.Manutencao.dto.HistoricoStatusResponse;
import com.Manutencao.api.dto.ManutencaoRequest;


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
        SolicitacaoResponse resp = solicitacaoService.buscarPorId(id);
        return ResponseEntity.ok(resp);
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

    @GetMapping("/em-aberto")
    public ResponseEntity<List<SolicitacaoResponse>> listarEmAberto() {
        return ResponseEntity.ok(solicitacaoService.listarEmAberto());
    }
    @PostMapping("/{id}/resgatar")
    public ResponseEntity<Boolean> resgatarSolicitacao(@PathVariable Long id) {
        boolean resultado = solicitacaoService.resgatarSolicitacao(id);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/{id}/efetuar-manutencao")
    public ResponseEntity<SolicitacaoResponse> efetuarManutencao(
            @PathVariable Long id,
            @RequestBody ManutencaoRequest req
    ) {
        if (!id.equals(req.solicitacaoId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(solicitacaoService.efetuarManutencao(req));
    }


    public record MotivoRejeicao(String motivo) {}
}
