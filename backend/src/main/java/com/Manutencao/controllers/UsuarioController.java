package com.Manutencao.api.controller;

import com.Manutencao.api.dto.FuncionarioRequest;
import com.Manutencao.api.dto.FuncionarioResponse;
import com.Manutencao.api.dto.UsuarioResponse;
import com.Manutencao.services.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> getUsuarioById(@PathVariable Long id) {
        UsuarioResponse usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/funcionarios")
    public List<FuncionarioResponse> listFuncionarios() {
        return usuarioService.listarFuncionarios();
    }

    @PostMapping("/funcionarios")
    public ResponseEntity<?> createFuncionario(@Valid @RequestBody FuncionarioRequest req) {
        try {
            FuncionarioResponse resp = usuarioService.cadastrarFuncionario(req);
            return ResponseEntity
                    .created(URI.create("/api/usuarios/funcionarios/" + resp.id()))
                    .body(resp);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.unprocessableEntity().body(ex.getMessage());
        }
    }
}
