package com.Manutencao.api.dto;

import jakarta.validation.constraints.NotBlank;

public record EnderecoRequest(
        @NotBlank String cep,
        @NotBlank String logradouro,
        String numero,
        String complemento,
        @NotBlank String bairro,
        @NotBlank String cidade,
        @NotBlank String uf
) {}
