package com.Manutencao.services;

import com.Manutencao.api.dto.AuthResponse;
import com.Manutencao.api.dto.LoginRequest;
import com.Manutencao.api.dto.RegisterRequest;
import com.Manutencao.models.Endereco;
import com.Manutencao.models.Perfil;
import com.Manutencao.models.Usuario;
import com.Manutencao.repositories.EnderecoRepository;
import com.Manutencao.repositories.PerfilRepository;
import com.Manutencao.repositories.UsuarioRepository;
import com.Manutencao.security.PasswordHasher;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Locale;

import static com.Manutencao.mappers.RequestMapper.toEndereco;
import static com.Manutencao.mappers.RequestMapper.toUsuario;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoRepository enderecoRepository;
    private final PerfilRepository perfilRepository;

    private static final SecureRandom RNG = new SecureRandom();

    public AuthService(UsuarioRepository usuarioRepository,
                       EnderecoRepository enderecoRepository,
                       PerfilRepository perfilRepository) {
        this.usuarioRepository = usuarioRepository;
        this.enderecoRepository = enderecoRepository;
        this.perfilRepository = perfilRepository;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        final String emailNorm = req.email().toLowerCase(Locale.ROOT).trim();

        if (usuarioRepository.existsByEmail(emailNorm)) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }
        if (req.cpf() != null && !req.cpf().isBlank() && usuarioRepository.existsByCpf(req.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }
        if (req.endereco() == null) {
            throw new IllegalArgumentException("Endereço é obrigatório");
        }

        int perfilId = ("ADMIN".equalsIgnoreCase(req.perfil())) ? 1 : 0;
        Perfil perfil = perfilRepository.findById(perfilId)
                .orElseThrow(() -> new IllegalStateException("Perfis base não inicializados (esperado id=0 USER, id=1 ADMIN)"));

        String senhaPlano = String.format("%04d", RNG.nextInt(10000));

        // hash + salt
        String salt = PasswordHasher.generateSalt();
        String hash = PasswordHasher.hash(senhaPlano, salt);

        Usuario novo = toUsuario(req);
        novo.setEmail(emailNorm);     
        novo.setSenhaSalt(salt);
        novo.setSenhaHash(hash);
        novo.setPerfil(perfil);  

        Usuario salvo = usuarioRepository.save(novo);

        Endereco end = toEndereco(req.endereco(), salvo);
        enderecoRepository.save(end);

        return new AuthResponse(
                salvo.getId(),
                salvo.getNome(),
                salvo.getEmail(),
                salvo.getPerfil() != null ? salvo.getPerfil().getNome() : null,
                "Usuário cadastrado com sucesso"
        );
    }

    public AuthResponse login(LoginRequest req) {
        Usuario user = usuarioRepository.findByEmail(
                req.email().toLowerCase(Locale.ROOT).trim()
        ).orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas"));

        String computed = PasswordHasher.hash(req.senha(), user.getSenhaSalt());
        if (!computed.equals(user.getSenhaHash()) || !user.isAtivo()) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }

        return new AuthResponse(
                user.getId(),
                user.getNome(),
                user.getEmail(),
                user.getPerfil() != null ? user.getPerfil().getNome() : null,
                "Login efetuado"
        );
    }
}
