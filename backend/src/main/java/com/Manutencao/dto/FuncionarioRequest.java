package com.Manutencao.api.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record FuncionarioRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 2) String nome,
        @NotNull @Past LocalDate dataNascimento,
        @NotBlank @Size(min = 6) String senha
) {}
