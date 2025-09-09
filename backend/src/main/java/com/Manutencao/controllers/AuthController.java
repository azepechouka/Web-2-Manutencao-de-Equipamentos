package com.Manutencao.api.controllers;

import com.Manutencao.api.dto.AuthResponse;
import com.Manutencao.api.dto.LoginRequest;
import com.Manutencao.api.dto.RegisterRequest;
import com.Manutencao.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest body) {
        return ResponseEntity.ok(auth.register(body));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest body) {
        return ResponseEntity.ok(auth.login(body));
    }