package com.Manutencao.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime; // ✅ Import adicionado!

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricoResponse {

    private Long id;

    private Long solicitacaoId;

    private Long deStatusId;
    private String deStatusNome;

    private Long paraStatusId;
    private String paraStatusNome;

    private Long usuarioId;
    private String usuarioNome;

    private String observacao;

    private LocalDateTime criadoEm; // ✅ Agora reconhecido corretamente
}
