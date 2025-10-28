package com.Manutencao.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoResponse {
    
    private Long id;
    private Long clienteId;
    private String clienteNome;
    private String descricaoEquipamento;
    private String modeloEquipamento;
    private String numeroSerieEquipamento;
    private Long categoriaEquipamentoId;
    private String categoriaEquipamentoNome;
    private String observacoes;
    private Long enderecoId;
    private Long statusAtualId;
    private String statusAtualNome;
    private String statusAtualCodigo;
    private Instant criadoEm;
    private Instant atualizadoEm;
}
