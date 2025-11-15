package com.Manutencao.api.dto;

import java.util.List;

public record ReceitaPorCategoria(
        String categoriaNome,     
        Double totalReceita,     
        Integer quantidadeServicos,  
        List<SolicitacaoResponse> solicitacoes 
) {}
