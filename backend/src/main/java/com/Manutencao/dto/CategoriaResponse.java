package com.Manutencao.dto;

import java.time.Instant;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoriaResponse {
    private Long id;
    private String nome;
    private String descricao;
    private boolean ativo;
    private Instant criadoEm;
    private Instant atualizadoEm;
}
