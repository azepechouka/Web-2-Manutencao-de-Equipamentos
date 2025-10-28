package com.Manutencao.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManutencaoResponse {
    
    private Long id;
    private Long solicitacaoId;
    private Long funcionarioId;
    private String funcionarioNome;
    private String descricaoServico;
    private String observacoes;
    private String status;
    private Instant criadoEm;
    private Instant atualizadoEm;
}
