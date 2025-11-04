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

    @NotNull(message = "O ID da solicitação é obrigatório.")
    private Long solicitacaoId;

    private Long deStatusId;

    @NotNull(message = "O novo status (paraStatusId) é obrigatório.")
    private Long paraStatusId;

    private Long usuarioId;

    @Size(max = 1000, message = "A observação pode ter no máximo 1000 caracteres.")
    private String observacao;
}
