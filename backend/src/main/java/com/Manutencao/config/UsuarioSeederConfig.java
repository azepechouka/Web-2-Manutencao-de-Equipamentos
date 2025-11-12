package com.Manutencao.config;

import com.Manutencao.models.Endereco;
import com.Manutencao.models.Perfil;
import com.Manutencao.models.Usuario;
import com.Manutencao.repositories.EnderecoRepository;
import com.Manutencao.repositories.PerfilRepository;
import com.Manutencao.repositories.UsuarioRepository;
import com.Manutencao.security.PasswordHasher;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Configuration
public class UsuarioSeederConfig {

    @Bean
    CommandLineRunner seedUsuarios(UsuarioRepository usuarios,
                                   PerfilRepository perfis,
                                   EnderecoRepository enderecos) {
        return args -> seed(usuarios, perfis, enderecos);
    }

    @Transactional
    void seed(UsuarioRepository usuarios,
              PerfilRepository perfis,
              EnderecoRepository enderecos) {

        Perfil userPerfil = perfis.findById(0)
                .orElseGet(() -> perfis.save(Perfil.builder().id(0).nome("USER").build()));

        Perfil adminPerfil = perfis.findById(1)
                .orElseGet(() -> perfis.save(Perfil.builder().id(1).nome("ADMIN").build()));

        criarSeNaoExistir(usuarios, enderecos, "func1@local", "Maria", "1111", LocalDate.of(1992, 3, 10), adminPerfil);
        criarSeNaoExistir(usuarios, enderecos, "func2@local", "Mário", "1111", LocalDate.of(1990, 7, 22), adminPerfil);

        criarSeNaoExistir(usuarios, enderecos, "cli1@local", "João", "1111", LocalDate.of(1995, 1, 15), userPerfil);
        criarSeNaoExistir(usuarios, enderecos, "cli2@local", "José", "1111", LocalDate.of(1988, 5, 9), userPerfil);
        criarSeNaoExistir(usuarios, enderecos, "cli3@local", "Joana", "1111", LocalDate.of(1993, 11, 3), userPerfil);
        criarSeNaoExistir(usuarios, enderecos, "cli4@local", "Joaquina", "1111", LocalDate.of(1991, 9, 27), userPerfil);
    }

    private void criarSeNaoExistir(UsuarioRepository usuarios,
                                   EnderecoRepository enderecos,
                                   String email,
                                   String nome,
                                   String senhaPura,
                                   LocalDate dataNascimento,
                                   Perfil perfil) {

        Optional<Usuario> existente = usuarios.findByEmail(email);
        if (existente.isPresent()) return;

        String saltB64 = PasswordHasher.generateSalt();
        String hashB64 = PasswordHasher.hash(senhaPura, saltB64);

        Usuario novo = Usuario.builder()
                .nome(nome)
                .email(email)
                .cpf(null)
                .telefone(null)
                .dataNascimento(dataNascimento != null ? dataNascimento : LocalDate.of(1990, 1, 1))
                .perfil(perfil)
                .senhaSalt(saltB64)
                .senhaHash(hashB64)
                .ativo(true)
                .build();

        Usuario salvo = usuarios.save(novo);

        // Adiciona endereço padrão
        Endereco endereco = Endereco.builder()
                .cep("01000-000")
                .logradouro("Rua Exemplo")
                .numero("123")
                .complemento("Apto 1")
                .bairro("Centro")
                .cidade("São Paulo")
                .uf("SP")
                .usuario(salvo)
                .build();

        enderecos.save(endereco);
    }
}
