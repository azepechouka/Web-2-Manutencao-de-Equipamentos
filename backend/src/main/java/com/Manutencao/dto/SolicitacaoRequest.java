package com.Manutencao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoRequest {
    
    @NotNull
    private Long clienteId;
    
    @NotBlank
    @Size(max = 500)
    private String descricaoEquipamento;
    
    @Size(max = 100)
    private String modeloEquipamento;
    
    @Size(max = 100)
    private String numeroSerieEquipamento;
    
    @NotNull
    private Long categoriaEquipamentoId;
    
    @Size(max = 1000)
    private String observacoes;
    
    @NotNull
    private Long enderecoId;
}
