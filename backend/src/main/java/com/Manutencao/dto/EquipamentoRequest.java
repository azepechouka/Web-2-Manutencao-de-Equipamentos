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
public class EquipamentoRequest {
    
    @NotNull
    private Long clienteId;
    
    @NotBlank
    @Size(max = 200)
    private String descricao;
    
    @Size(max = 100)
    private String modelo;
    
    @Size(max = 100)
    private String numeroSerie;
    
    @NotNull
    private Long categoriaId;
}
