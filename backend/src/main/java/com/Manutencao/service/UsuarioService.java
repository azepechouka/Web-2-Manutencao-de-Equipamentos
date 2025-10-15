package com.Manutencao.services;

import com.Manutencao.api.dto.FuncionarioRequest;
import com.Manutencao.api.dto.FuncionarioResponse;
import com.Manutencao.models.Perfil;
import com.Manutencao.models.Usuario;
import com.Manutencao.repositories.PerfilRepository;
import com.Manutencao.repositories.UsuarioRepository;
import com.Manutencao.security.PasswordHasher;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarios;
    private final PerfilRepository perfis;

    private static final int PERFIL_USER_ID = 0;
    private static final int PERFIL_ADMIN_ID = 1;
    public UsuarioService(UsuarioRepository usuarios, PerfilRepository perfis) {
        this.usuarios = usuarios;
        this.perfis = perfis;
    }

    @Transactional(readOnly = true)
    public List<FuncionarioResponse> listarFuncionarios() {
        return usuarios.findByPerfil_Id(PERFIL_ADMIN_ID).stream()
                .map(this::toFuncionarioResponse)
                .toList();
    }

    @Transactional
    public FuncionarioResponse cadastrarFuncionario(FuncionarioRequest req) {
        if (usuarios.findByEmail(req.email()).isPresent()) {
            throw new IllegalArgumentException("E-mail já está em uso.");
        }

        Perfil perfil = perfis.findById(PERFIL_ADMIN_ID)
                .orElseGet(() -> perfis.save(Perfil.builder()
                        .id(PERFIL_ADMIN_ID)
                        .nome(PERFIL_ADMIN_ID == 1 ? "ADMIN" : "USER")
                        .build()));

        String salt = PasswordHasher.generateSalt();
        String hash = PasswordHasher.hash(req.senha(), salt);

        Usuario u = Usuario.builder()
                .email(req.email())
                .nome(req.nome())
                .dataNascimento(req.dataNascimento())
                .perfil(perfil)
                .senhaSalt(salt)
                .senhaHash(hash)
                .ativo(true)
                .build();

        try {
            usuarios.save(u);
            return toFuncionarioResponse(u);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }
    }

    private FuncionarioResponse toFuncionarioResponse(Usuario u) {
        return new FuncionarioResponse(
                u.getId(),
                u.getEmail(),
                u.getNome(),
                u.getDataNascimento(),
                u.getPerfil() != null ? u.getPerfil().getNome() : null
        );
    }
}
