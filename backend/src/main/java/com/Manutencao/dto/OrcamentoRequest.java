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

    @NotNull(message = "O ID da solicitação é obrigatório.")
    private Long solicitacaoId;

    @NotNull(message = "O valor total é obrigatório.")
    @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero.")
    private BigDecimal valorTotal;

    @Size(max = 1000, message = "A observação pode ter no máximo 1000 caracteres.")
    private String observacao;

    @NotNull(message = "O ID do funcionário é obrigatório.")
    private Long funcionarioId;
}
