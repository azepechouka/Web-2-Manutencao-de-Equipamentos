package com.Manutencao.mappers;

import com.Manutencao.api.dto.AuthResponse;
import com.Manutencao.api.dto.EnderecoRequest;
import com.Manutencao.api.dto.RegisterRequest;
import com.Manutencao.models.Endereco;
import com.Manutencao.models.Usuario;

import java.util.Locale;

public final class RequestMapper {

    private RequestMapper() {}

    // ---------- DTO → ENTITY ----------
    public static Usuario toUsuario(RegisterRequest req) {
        Usuario u = Usuario.builder().build();
        u.setNome(nz(req.nome()));
        u.setEmail(normalizeEmail(req.email()));
        u.setCpf(trim(req.cpf()));
        u.setTelefone(trim(req.telefone()));
        u.setDataNascimento(req.dataNascimento());
        u.setAtivo(true);
        return u;
    }

    public static Endereco toEndereco(EnderecoRequest dto, Usuario dono) {
        Endereco e = Endereco.builder().build();
        e.setUsuario(dono);
        e.setCep(trim(dto.cep()));
        e.setLogradouro(trim(dto.logradouro()));
        e.setNumero(trim(dto.numero()));
        e.setComplemento(trim(dto.complemento()));
        e.setBairro(trim(dto.bairro()));
        e.setCidade(trim(dto.cidade()));
        e.setUf(trim(dto.uf()));
        return e;
    }

    // ---------- ENTITY → DTO ----------
    public static AuthResponse toAuthResponse(Usuario u, String message) {
        return new AuthResponse(
                u.getId(),
                u.getNome(),
                u.getEmail(),
                u.getPerfil() != null ? u.getPerfil().getNome() : null, // entidade Perfil -> nome
                message
        );
    }

    // ---------- Helpers ----------
    private static String normalizeEmail(String email) {
        return email == null ? null : email.toLowerCase(Locale.ROOT).trim();
    }
    private static String trim(String s) { return s == null ? null : s.trim(); }
    private static String nz(String s)   { return s == null ? ""   : s.trim(); }
}
