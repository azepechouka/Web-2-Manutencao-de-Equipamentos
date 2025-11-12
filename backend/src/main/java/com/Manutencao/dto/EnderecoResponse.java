package com.Manutencao.api.dto;

import java.time.LocalDateTime;

public record EnderecoResponse(
    Long id,
    String cep,
    String logradouro,
    String numero,
    String complemento,
    String bairro,
    String cidade,
    String uf,
    LocalDateTime criadoEm,
    LocalDateTime atualizadoEm
) {}
