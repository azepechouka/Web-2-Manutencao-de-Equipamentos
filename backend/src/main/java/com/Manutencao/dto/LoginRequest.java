package com.Manutencao.api.dto;

import jakarta.validation.constraints.*;

public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String senha
) {}
