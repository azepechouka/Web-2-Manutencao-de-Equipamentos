package com.Manutencao.api.dto;

public record EnderecoRequest(
        String cep,
        String logradouro,
        String numero,
        String complemento,
        String bairro,
        String localidade, // cidade
        String uf
) {}
