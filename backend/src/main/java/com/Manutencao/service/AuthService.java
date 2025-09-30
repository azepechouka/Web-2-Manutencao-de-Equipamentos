package com.Manutencao.services;

import com.Manutencao.api.dto.AuthResponse;
import com.Manutencao.api.dto.LoginRequest;
import com.Manutencao.api.dto.RegisterRequest;
import com.Manutencao.models.Endereco;
import com.Manutencao.models.Usuario;
import com.Manutencao.repositories.EnderecoRepository;
import com.Manutencao.repositories.UsuarioRepository;
import com.Manutencao.security.PasswordHasher;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Locale;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoRepository enderecoRepository;
    private static final SecureRandom RNG = new SecureRandom();

    public AuthService(UsuarioRepository usuarioRepository,
                       EnderecoRepository enderecoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.enderecoRepository = enderecoRepository;
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

        // 1) SEMPRE gerar senha numérica de 4 dígitos (ignora req.senha())
        String senhaPlano = gerarSenha4Digitos();

        // 2) hash + salt
        String salt = PasswordHasher.generateSalt();
        String hash = PasswordHasher.hash(senhaPlano, salt);

        // 3) criar e salvar usuário
        Usuario novo = Usuario.builder()
                .nome(req.nome())
                .email(emailNorm)
                .cpf(req.cpf())
                .telefone(req.telefone())
                .dataNascimento(req.dataNascimento())
                .perfil(req.perfil())
                .senhaSalt(salt)
                .senhaHash(hash)
                .ativo(true)
                .build();

        Usuario salvo = usuarioRepository.save(novo);

        // 4) criar e salvar endereço vinculado ao usuário
        Endereco end = Endereco.builder()
                .usuario(salvo)
                .cep(ns(req.endereco().cep()))
                .logradouro(ns(req.endereco().logradouro()))
                .numero(ns(req.endereco().numero()))
                .complemento(ns(req.endereco().complemento()))
                .bairro(ns(req.endereco().bairro()))
                .localidade(ns(req.endereco().localidade()))
                .uf(ns(req.endereco().uf()))
                .build();

        enderecoRepository.save(end);

        // 5) resposta (se quiser, aqui é o ponto para enviar o PIN por e-mail/SMS)
        return new AuthResponse(
                salvo.getId(),
                salvo.getNome(),
                salvo.getEmail(),
                salvo.getPerfil().name(),
                "Usuário cadastrado com sucesso"
        );
    }

    public AuthResponse login(LoginRequest req) {
        Usuario user = usuarioRepository.findByEmail(req.email().toLowerCase(Locale.ROOT).trim())
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

    // ---------- helpers ----------
    private String ns(String s) { return s == null ? "" : s.trim(); }
    private String gerarSenha4Digitos() {
        return String.format("%04d", RNG.nextInt(10000));
    }
}
