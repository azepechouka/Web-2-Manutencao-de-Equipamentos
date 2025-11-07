package com.Manutencao.config;

import com.Manutencao.models.Categoria;
import com.Manutencao.repositories.CategoriaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class CategoriaSeederConfig {

    @Bean
    CommandLineRunner seedCategorias(CategoriaRepository repo) {
        return args -> seed(repo);
    }

    @Transactional
    void seed(CategoriaRepository repo) {
        upsert(repo, "Impressora", null);
        upsert(repo, "Notebook", null);
        upsert(repo, "Desktop", null);
        upsert(repo, "Roteador", null);
        upsert(repo, "Scanner", null);
    }

    private void upsert(CategoriaRepository repo, String nome, String descricao) {
        if (!repo.existsByNomeIgnoreCase(nome)) {
            repo.save(Categoria.builder()
                    .nome(nome)
                    .descricao(descricao)
                    .ativo(true)
                    .build());
        }
    }
}
