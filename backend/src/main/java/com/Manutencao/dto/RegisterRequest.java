package com.Manutencao.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        String cpf,
        @NotBlank String nome,
        @Email @NotBlank String email,
        String telefone,
        String perfil,             
        EnderecoRequest endereco 
)
