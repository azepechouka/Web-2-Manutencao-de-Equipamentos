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
public class ManutencaoRequest {
    
    @NotNull
    private Long solicitacaoId;
    
    @NotNull
    private Long funcionarioId;
    
    @NotBlank
    @Size(max = 1000)
    private String descricaoServico;
    
    @Size(max = 1000)
    private String observacoes;
    
    private Long funcionarioDestinoId; // Para redirecionamento
}
