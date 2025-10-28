package com.Manutencao.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrcamentoRequest {
    
    @NotNull
    private Long solicitacaoId;
    
    @NotNull
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valorTotal;
    
    @NotBlank
    @Size(max = 3)
    private String moeda;
    
    @Size(max = 1000)
    private String observacao;
    
    @NotNull
    private Long funcionarioId;
}
