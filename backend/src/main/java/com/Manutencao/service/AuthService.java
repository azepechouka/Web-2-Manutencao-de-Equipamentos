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
import java.time.LocalDate;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Locale;

import static com.Manutencao.mappers.RequestMapper.toEndereco;
import static com.Manutencao.mappers.RequestMapper.toUsuario;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoRepository enderecoRepository;
    private final PerfilRepository perfilRepository;

    public AuthService(UsuarioRepository usuarioRepository,
                       EnderecoRepository enderecoRepository,
                       PerfilRepository perfilRepository) {
        this.usuarioRepository = usuarioRepository;
        this.enderecoRepository = enderecoRepository;
        this.perfilRepository = perfilRepository;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {

        if (req.email() == null || req.email().isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório");
        }

        final String emailNorm = req.email().toLowerCase(Locale.ROOT).trim();

        if (!isEmailValido(emailNorm)) {
            throw new IllegalArgumentException("Formato de e-mail inválido");
        }

        if (usuarioRepository.existsByEmail(emailNorm)) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        if (req.nome() == null || req.nome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        if (req.nome().trim().length() < 3) {
            throw new IllegalArgumentException("Nome deve ter pelo menos 3 caracteres");
        }

        // CPF 
        if (req.cpf() == null || req.cpf().isBlank()) {
            throw new IllegalArgumentException("CPF é obrigatório");
        }

        if (!req.cpf().matches("^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$")) {
            throw new IllegalArgumentException("CPF inválido. Use o formato 000.000.000-00");
        }

        if (!cpfEhValido(req.cpf())) {
            throw new IllegalArgumentException("CPF inválido");
        }

        if (usuarioRepository.existsByCpf(req.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        if (usuarioRepository.existsByEmail(req.email().toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        // TELEFONE 
        if (req.telefone() != null && !req.telefone().isBlank()) {
            if (!req.telefone().matches("^\\(\\d{2}\\) \\d{5}-\\d{4}$")) {
                throw new IllegalArgumentException("Telefone inválido (use o formato (00) 00000-0000)");
            }
        }

        // DATA DE NASCIMENTO 
        if (req.dataNascimento() == null) {
            throw new IllegalArgumentException("Data de nascimento é obrigatória");
        }

        if (req.dataNascimento().isAfter(LocalDate.now().minusYears(18))) {
            throw new IllegalArgumentException("É necessário ter pelo menos 18 anos");
        }

        // ENDEREÇO
        if (req.endereco() == null) {
            throw new IllegalArgumentException("Endereço é obrigatório");
        }

        var end = req.endereco();

        if (end.cep() == null || !end.cep().matches("^\\d{5}-\\d{3}$")) {
            throw new IllegalArgumentException("CEP inválido. Use o formato 00000-000");
        }

        if (end.logradouro() == null || end.logradouro().isBlank()) {
            throw new IllegalArgumentException("Logradouro é obrigatório");
        }

        if (end.numero() == null || !end.numero().matches("\\d+")) {
            throw new IllegalArgumentException("Número deve conter apenas dígitos");
        }

        if (end.bairro() == null || end.bairro().isBlank()) {
            throw new IllegalArgumentException("Bairro é obrigatório");
        }

        if (end.cidade() == null || end.cidade().isBlank()) {
            throw new IllegalArgumentException("Cidade é obrigatória");
        }

        if (end.uf() == null || !end.uf().matches("^[A-Za-z]{2}$")) {
            throw new IllegalArgumentException("UF inválida. Use duas letras, ex: SP");
        }

        // PERFIL
        if (req.perfil() == null) {
            throw new IllegalArgumentException("Perfil é obrigatório");
        }

        int perfilId = ("ADMIN".equalsIgnoreCase(req.perfil())) ? 1 : 0;

        Perfil perfil = perfilRepository.findById(perfilId)
                .orElseThrow(() -> new IllegalStateException(
                        "Perfis base não inicializados (esperado id=0 USER, id=1 ADMIN)")
                );

        // SENHA PADRÃO
        String senhaPlano = "1111";
        String salt = PasswordHasher.generateSalt();
        String hash = PasswordHasher.hash(senhaPlano, salt);

        // MAPEAMENTO DO USUÁRIO
        Usuario novo = toUsuario(req);
        novo.setEmail(emailNorm);
        novo.setSenhaSalt(salt);
        novo.setSenhaHash(hash);
        novo.setPerfil(perfil);

        Usuario salvo = usuarioRepository.save(novo);

        Endereco endereco = toEndereco(req.endereco(), salvo);
        enderecoRepository.save(endereco);

        return new AuthResponse(
                salvo.getId(),
                salvo.getNome(),
                salvo.getEmail(),
                salvo.getPerfil() != null ? salvo.getPerfil().getNome() : null,
                "Usuário cadastrado com sucesso"
        );
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        final String email = req.email().toLowerCase(Locale.ROOT).trim();

        Usuario user = usuarioRepository
                .findByEmailAndFetchPerfilEagerly(email)
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas"));

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

    // FUNÇÃO AUXILIAR: EMAIL
    private boolean isEmailValido(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }

    // FUNÇÃO AUXILIAR: VALIDAÇÃO REAL DE CPF
    private boolean cpfEhValido(String cpf) {
        cpf = cpf.replace(".", "").replace("-", "");

        if (cpf.length() != 11) return false;
        if (cpf.matches("(\\d)\\1{10}")) return false;

        try {
            int soma = 0, peso = 10;

            for (int i = 0; i < 9; i++) {
                soma += (cpf.charAt(i) - '0') * peso--;
            }

            int dig1 = 11 - (soma % 11);
            if (dig1 >= 10) dig1 = 0;

            soma = 0;
            peso = 11;

            for (int i = 0; i < 10; i++) {
                soma += (cpf.charAt(i) - '0') * peso--;
            }

            int dig2 = 11 - (soma % 11);
            if (dig2 >= 10) dig2 = 0;

            return dig1 == (cpf.charAt(9) - '0') &&
                   dig2 == (cpf.charAt(10) - '0');

        } catch (Exception e) {
            return false;
        }
    }
}
