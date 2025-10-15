package com.Manutencao.mappers;

import com.Manutencao.dto.CategoriaRequest;
import com.Manutencao.dto.CategoriaResponse;
import com.Manutencao.models.Categoria;

public final class CategoriaMapper {
    private CategoriaMapper(){}

    public static Categoria toEntity(CategoriaRequest req) {
        return Categoria.builder()
                .nome(req.getNome().trim())
                .descricao(req.getDescricao())
                .ativo(req.getActivoOrDefault())
                .build();
    }

    public static void copyToEntity(CategoriaRequest req, Categoria entity) {
        entity.setNome(req.getNome().trim());
        entity.setDescricao(req.getDescricao());
        if (req.getAtivo() != null) {
            entity.setAtivo(req.getAtivo());
        }
    }

    public static CategoriaResponse toResponse(Categoria c) {
        return CategoriaResponse.builder()
                .id(c.getId())
                .nome(c.getNome())
                .descricao(c.getDescricao())
                .ativo(c.isAtivo())
                .criadoEm(c.getCriadoEm())
                .atualizadoEm(c.getAtualizadoEm())
                .build();
    }
}
