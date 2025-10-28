package com.Manutencao.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoRequest {
    
    @NotNull
    private Long solicitacaoId;
    
    private Long deStatusId;
    
    @NotNull
    private Long paraStatusId;
    
    private Long usuarioId;
    
    @Size(max = 1000)
    private String observacao;
}
