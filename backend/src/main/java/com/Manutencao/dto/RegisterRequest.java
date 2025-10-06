package com.Manutencao.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record RegisterRequest(
        String cpf,
        @NotBlank String nome,
        @Email @NotBlank String email,
        String telefone,
        String perfil,
        LocalDate dataNascimento,
        @Valid EnderecoRequest endereco
) {}
