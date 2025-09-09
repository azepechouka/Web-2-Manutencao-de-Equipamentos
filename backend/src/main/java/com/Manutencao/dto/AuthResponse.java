package com.Manutencao.api.dto;

public record AuthResponse(
        Long id,
        String nome,
        String email,
        String perfil,
        String mensagem
) {}
