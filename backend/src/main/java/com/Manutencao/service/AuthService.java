package com.Manutencao.services;

import com.Manutencao.api.dto.AuthResponse;
import com.Manutencao.api.dto.LoginRequest;
import com.Manutencao.api.dto.RegisterRequest;
import com.Manutencao.models.Usuario;
import com.Manutencao.repositories.UsuarioRepository;
import com.Manutencao.security.PasswordHasher;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (usuarioRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }
        if (req.cpf() != null && !req.cpf().isBlank() && usuarioRepository.existsByCpf(req.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        String salt = PasswordHasher.generateSalt();
        String hash = PasswordHasher.hash(req.senha(), salt);

        Usuario novo = Usuario.builder()
                .nome(req.nome())
                .email(req.email().toLowerCase().trim())
                .cpf(req.cpf())
                .telefone(req.telefone())
                .dataNascimento(req.dataNascimento())
                .perfil(req.perfil())
                .senhaSalt(salt)
                .senhaHash(hash)
                .ativo(true)
                .build();

        Usuario salvo = usuarioRepository.save(novo);
        return new AuthResponse(
                salvo.getId(),
                salvo.getNome(),
                salvo.getEmail(),
                salvo.getPerfil().name(),
                "Usuário cadastrado com sucesso"
        );
    }

    public AuthResponse login(LoginRequest req) {
        Usuario user = usuarioRepository.findByEmail(req.email().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas"));

        String computed = PasswordHasher.hash(req.senha(), user.getSenhaSalt());
        if (!computed.equals(user.getSenhaHash()) || !user.isAtivo()) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }

        return new AuthResponse(
                user.getId(),
                user.getNome(),
                user.getEmail(),
                user.getPerfil().name(),
                "Login efetuado"
        );
    }
}