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

import java.util.Locale;
import java.util.Random;
import java.time.LocalDate;
import java.time.Period;

import static com.Manutencao.mappers.RequestMapper.toEndereco;
import static com.Manutencao.mappers.RequestMapper.toUsuario;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoRepository enderecoRepository;
    private final PerfilRepository perfilRepository;
    private final EmailService emailService;

    public AuthService(UsuarioRepository usuarioRepository,
                       EnderecoRepository enderecoRepository,
                       PerfilRepository perfilRepository,
                       EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.enderecoRepository = enderecoRepository;
        this.perfilRepository = perfilRepository;
        this.emailService = emailService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        try {
            // Validações simplificadas
            validarDadosUsuario(req);
            
            // Remove máscaras
            String cpfLimpo = req.cpf().replaceAll("\\D", "");
            String telefoneLimpo = req.telefone().replaceAll("\\D", "");
            String cepLimpo = req.endereco().cep().replaceAll("\\D", "");
            
            // Valida formato dos campos
            if (cpfLimpo.length() != 11) {
                throw new IllegalArgumentException("CPF deve ter 11 dígitos");
            }
            if (telefoneLimpo.length() != 11) {
                throw new IllegalArgumentException("Telefone deve ter 11 dígitos");
            }
            if (cepLimpo.length() != 8) {
                throw new IllegalArgumentException("CEP deve ter 8 dígitos");
            }
            
            // Valida CPF
            if (!cpfEhValido(cpfLimpo)) {
                throw new IllegalArgumentException("CPF inválido");
            }
            
            // Verifica duplicatas
            final String emailNorm = req.email().toLowerCase(Locale.ROOT).trim();
            if (usuarioRepository.existsByEmail(emailNorm)) {
                throw new IllegalArgumentException("E-mail já cadastrado");
            }
            if (usuarioRepository.existsByCpf(cpfLimpo)) {
                throw new IllegalArgumentException("CPF já cadastrado");
            }

            // Processa perfil
            int perfilId = obterPerfilId(req.perfil());
            Perfil perfil = perfilRepository.findById(perfilId)
                    .orElseThrow(() -> new IllegalArgumentException("Perfil não encontrado"));

            // Gera senha temporária
            String senhaPlano = gerarSenhaTemporaria();
            String salt = PasswordHasher.generateSalt();
            String hash = PasswordHasher.hash(senhaPlano, salt);

            // Cria usuário
            Usuario novo = toUsuario(req);
            novo.setEmail(emailNorm);
            novo.setCpf(cpfLimpo);
            novo.setTelefone(telefoneLimpo);
            novo.setSenhaSalt(salt);
            novo.setSenhaHash(hash);
            novo.setPerfil(perfil);

            Usuario salvo = usuarioRepository.save(novo);

            // Cria endereço
            Endereco endereco = toEndereco(req.endereco(), salvo);
            endereco.setCep(cepLimpo);
            enderecoRepository.save(endereco);

            // Envia email
            emailService.sendTemporaryPassword(novo.getEmail(), novo.getNome(), senhaPlano);

            return new AuthResponse(
                    salvo.getId(),
                    salvo.getNome(),
                    salvo.getEmail(),
                    salvo.getPerfil() != null ? salvo.getPerfil().getNome() : null,
                    "Usuário cadastrado com sucesso"
            );
        } catch (jakarta.mail.MessagingException e) {
            throw new IllegalStateException("Erro ao enviar e-mail com a senha temporária", e);
        }
    }

    private void validarDadosUsuario(RegisterRequest req) {
        // Validações básicas
        if (req.nome() == null || req.nome().trim().length() < 3) {
            throw new IllegalArgumentException("Nome deve ter pelo menos 3 caracteres");
        }
        
        if (req.email() == null || !isEmailValido(req.email())) {
            throw new IllegalArgumentException("E-mail inválido");
        }
        
        if (req.cpf() == null || req.cpf().isBlank()) {
            throw new IllegalArgumentException("CPF é obrigatório");
        }
        
        if (req.telefone() == null || req.telefone().isBlank()) {
            throw new IllegalArgumentException("Telefone é obrigatório");
        }
        
        if (req.dataNascimento() == null) {
            throw new IllegalArgumentException("Data de nascimento é obrigatória");
        }
        
        if (req.dataNascimento().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Data de nascimento não pode ser futura");
        }
        
        Period idade = Period.between(req.dataNascimento(), LocalDate.now());
        if (idade.getYears() < 18) {
            throw new IllegalArgumentException("É necessário ter pelo menos 12 anos");
        }
        
        // Valida endereço
        if (req.endereco() == null) {
            throw new IllegalArgumentException("Endereço é obrigatório");
        }
        
        var end = req.endereco();
        if (end.cep() == null || end.cep().isBlank()) {
            throw new IllegalArgumentException("CEP é obrigatório");
        }
        if (end.logradouro() == null || end.logradouro().isBlank()) {
            throw new IllegalArgumentException("Logradouro é obrigatório");
        }
        if (end.numero() == null || end.numero().isBlank()) {
            throw new IllegalArgumentException("Número é obrigatório");
        }
        if (end.bairro() == null || end.bairro().isBlank()) {
            throw new IllegalArgumentException("Bairro é obrigatório");
        }
        if (end.cidade() == null || end.cidade().isBlank()) {
            throw new IllegalArgumentException("Cidade é obrigatória");
        }
        if (end.uf() == null || end.uf().length() != 2) {
            throw new IllegalArgumentException("UF deve ter 2 caracteres");
        }
        
        if (req.perfil() == null || req.perfil().isBlank()) {
            throw new IllegalArgumentException("Perfil é obrigatório");
        }
    }

    private int obterPerfilId(String perfil) {
        try {
            return Integer.parseInt(perfil);
        } catch (NumberFormatException e) {
            String perfilUpper = perfil.toUpperCase();
            switch (perfilUpper) {
                case "USER":
                case "CLIENTE":
                    return 0;
                case "ADMIN":
                case "ADMINISTRADOR":
                    return 1;
                default:
                    throw new IllegalArgumentException("Perfil inválido: " + perfil);
            }
        }
    }

    private String gerarSenhaTemporaria() {
        Random random = new Random();
        int senha = 1000 + random.nextInt(9000);
        return String.valueOf(senha);
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

    private boolean isEmailValido(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }

    private boolean cpfEhValido(String cpf) {
        if (cpf.length() != 11 || cpf.matches("(\\d)\\1{10}")) {
            return false;
        }

        try {
            // Calcula primeiro dígito
            int soma = 0;
            for (int i = 0; i < 9; i++) {
                soma += (cpf.charAt(i) - '0') * (10 - i);
            }
            int dig1 = 11 - (soma % 11);
            if (dig1 >= 10) dig1 = 0;

            // Calcula segundo dígito
            soma = 0;
            for (int i = 0; i < 10; i++) {
                soma += (cpf.charAt(i) - '0') * (11 - i);
            }
            int dig2 = 11 - (soma % 11);
            if (dig2 >= 10) dig2 = 0;

            return dig1 == (cpf.charAt(9) - '0') && dig2 == (cpf.charAt(10) - '0');
        } catch (Exception e) {
            return false;
        }
    }
}