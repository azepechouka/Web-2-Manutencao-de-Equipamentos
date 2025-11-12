package com.Manutencao.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UsuarioResponse(
    Long id,
    String nome,
    String email,
    String telefone,
    String perfil,
    boolean ativo,
    LocalDate dataNascimento,
    LocalDateTime criadoEm,
    LocalDateTime atualizadoEm
) {}
