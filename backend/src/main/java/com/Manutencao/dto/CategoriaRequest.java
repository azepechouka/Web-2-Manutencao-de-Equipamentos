package com.Manutencao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaRequest {
    @NotBlank
    @Size(max = 80)
    private String nome;

    private String descricao;

    private Boolean ativo;

    // útil pro mapper
    public boolean getActivoOrDefault() {
        return ativo == null || Boolean.TRUE.equals(ativo);
    }
}
