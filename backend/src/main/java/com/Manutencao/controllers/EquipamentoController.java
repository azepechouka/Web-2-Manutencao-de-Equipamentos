package com.Manutencao.controllers;

import com.Manutencao.dto.EquipamentoRequest;
import com.Manutencao.dto.EquipamentoResponse;
import com.Manutencao.service.EquipamentoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/equipamentos")
public class EquipamentoController {

    private final EquipamentoService service;

    public EquipamentoController(EquipamentoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<EquipamentoResponse>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipamentoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<EquipamentoResponse>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(service.listarPorCliente(clienteId));
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<EquipamentoResponse>> listarPorCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(service.listarPorCategoria(categoriaId));
    }

    @GetMapping("/numero-serie/{numeroSerie}")
    public ResponseEntity<List<EquipamentoResponse>> buscarPorNumeroSerie(@PathVariable String numeroSerie) {
        return ResponseEntity.ok(service.buscarPorNumeroSerie(numeroSerie));
    }

    @PostMapping
    public ResponseEntity<EquipamentoResponse> criar(@RequestBody @Valid EquipamentoRequest request) {
        EquipamentoResponse created = service.criar(request);
        return ResponseEntity.created(URI.create("/api/equipamentos/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipamentoResponse> atualizar(@PathVariable Long id, 
                                                        @RequestBody @Valid EquipamentoRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
