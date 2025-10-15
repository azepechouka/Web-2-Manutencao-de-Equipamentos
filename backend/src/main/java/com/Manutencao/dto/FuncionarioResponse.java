package com.Manutencao.api.dto;

import java.time.LocalDate;

public record FuncionarioResponse(
        Long id,
        String email,
        String nome,
        LocalDate dataNascimento,
        String perfil
) {}
