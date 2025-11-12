package com.Manutencao.mappers;

import com.Manutencao.models.Usuario;
import com.Manutencao.api.dto.UsuarioResponse;
import com.Manutencao.api.dto.EnderecoResponse;
import java.util.List;

public class UsuarioMapper {

    public static UsuarioResponse toResponse(Usuario u) {
        List<EnderecoResponse> enderecos = u.getEnderecos() != null
            ? u.getEnderecos().stream()
                .map(e -> new EnderecoResponse(
                        e.getId(),
                        e.getCep(),
                        e.getLogradouro(),
                        e.getNumero(),
                        e.getComplemento(),
                        e.getBairro(),
                        e.getCidade(),
                        e.getUf(),
                        e.getCriadoEm(),
                        e.getAtualizadoEm()
                ))
                .toList()
            : List.of();

        return new UsuarioResponse(
            u.getId(),
            u.getNome(),
            u.getEmail(),
            u.getTelefone(),
            u.getPerfil() != null ? u.getPerfil().getNome() : null,
            u.isAtivo(),
            u.getDataNascimento(),
            u.getCriadoEm(),
            u.getAtualizadoEm(),
            enderecos
        );
    }
}
