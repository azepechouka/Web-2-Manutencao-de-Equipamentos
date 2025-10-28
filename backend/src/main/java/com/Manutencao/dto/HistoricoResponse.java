package com.Manutencao.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoResponse {
    
    private Long id;
    private Long solicitacaoId;
    private Long deStatusId;
    private String deStatusNome;
    private Long paraStatusId;
    private String paraStatusNome;
    private Long usuarioId;
    private String usuarioNome;
    private String observacao;
    private Instant criadoEm;
}
