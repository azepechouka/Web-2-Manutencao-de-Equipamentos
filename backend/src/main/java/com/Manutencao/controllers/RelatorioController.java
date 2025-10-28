package com.Manutencao.controllers;

import com.Manutencao.service.RelatorioService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final RelatorioService service;

    public RelatorioController(RelatorioService service) {
        this.service = service;
    }

    @GetMapping("/receita")
    public ResponseEntity<List<Map<String, Object>>> relatorioReceita(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        return ResponseEntity.ok(service.relatorioReceita(dataInicio, dataFim));
    }

    @GetMapping("/receita/categoria")
    public ResponseEntity<List<Map<String, Object>>> relatorioReceitaPorCategoria(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        return ResponseEntity.ok(service.relatorioReceitaPorCategoria(dataInicio, dataFim));
    }

    @GetMapping("/solicitacoes")
    public ResponseEntity<List<Map<String, Object>>> relatorioSolicitacoes(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        return ResponseEntity.ok(service.relatorioSolicitacoes(dataInicio, dataFim));
    }

    @GetMapping("/funcionarios")
    public ResponseEntity<List<Map<String, Object>>> relatorioFuncionarios() {
        return ResponseEntity.ok(service.relatorioFuncionarios());
    }

    @GetMapping("/equipamentos")
    public ResponseEntity<List<Map<String, Object>>> relatorioEquipamentos() {
        return ResponseEntity.ok(service.relatorioEquipamentos());
    }
}
