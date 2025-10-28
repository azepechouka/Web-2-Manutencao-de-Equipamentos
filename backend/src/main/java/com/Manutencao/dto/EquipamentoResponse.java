package com.Manutencao.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipamentoResponse {
    
    private Long id;
    private Long clienteId;
    private String clienteNome;
    private String descricao;
    private String modelo;
    private String numeroSerie;
    private Long categoriaId;
    private String categoriaNome;
    private Instant criadoEm;
}
