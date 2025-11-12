package com.Manutencao.mappers;

import com.Manutencao.models.Usuario;
import com.Manutencao.api.dto.UsuarioResponse;

public class UsuarioMapper {

    public static UsuarioResponse toResponse(Usuario u) {
        return new UsuarioResponse(
            u.getId(),
            u.getNome(),
            u.getEmail(),
            u.getTelefone(),
            u.getPerfil() != null ? u.getPerfil().getNome() : null,
            u.isAtivo(),
            u.getDataNascimento(),
            u.getCriadoEm(),
            u.getAtualizadoEm()
        );
    }
}
