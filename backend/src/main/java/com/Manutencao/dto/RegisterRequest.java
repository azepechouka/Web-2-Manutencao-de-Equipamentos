package com.Manutencao.api.dto;

import com.Manutencao.models.PerfilUsuario;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record RegisterRequest(
        @NotBlank @Size(max = 150) String nome,
        @NotBlank @Email @Size(max = 255) String email,
        @Pattern(regexp = "^\\d{11}$", message = "CPF deve ter 11 dígitos") String cpf,
        @Size(max = 20) String telefone,
        LocalDate dataNascimento,
        @NotNull PerfilUsuario perfil,
        @NotBlank @Size(min = 8, max = 128) String senha
) {}
