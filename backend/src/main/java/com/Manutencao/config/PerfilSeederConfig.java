package com.Manutencao.config;

import com.Manutencao.models.Perfil;
import com.Manutencao.repositories.PerfilRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class PerfilSeederConfig {

    @Bean
    CommandLineRunner seedPerfis(PerfilRepository repo) {
        return args -> seed(repo);
    }

    @Transactional
    void seed(PerfilRepository repo) {
        // id 0 = USER
        repo.findById(0).orElseGet(() ->
            repo.save(Perfil.builder().id(0).nome("USER").build())
        );
        // id 1 = ADMIN
        repo.findById(1).orElseGet(() ->
            repo.save(Perfil.builder().id(1).nome("ADMIN").build())
        );
    }
}
