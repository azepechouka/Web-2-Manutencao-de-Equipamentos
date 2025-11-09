package com.Manutencao.config;

import com.Manutencao.models.EstadoSolicitacao;
import com.Manutencao.repositories.EstadoSolicitacaoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class EstadoSolicitacaoSeederConfig {

    @Bean
    CommandLineRunner seedEstadosSolicitacao(EstadoSolicitacaoRepository repo) {
        return args -> seed(repo);
    }

    @Transactional
    void seed(EstadoSolicitacaoRepository repo) {
        upsert(repo, "Aberta");
        upsert(repo, "Orçada");
        upsert(repo, "Rejeitada");
        upsert(repo, "Aprovada");
        upsert(repo, "Redirecionada");
        upsert(repo, "Arrumada");
        upsert(repo, "Paga");
        upsert(repo, "Finalizada");
    }

    private void upsert(EstadoSolicitacaoRepository repo, String nome) {
        var existente = repo.findByNomeIgnoreCase(nome).orElse(null);
        if (existente == null) {
            repo.save(EstadoSolicitacao.builder().nome(nome).build());
        } else if (!nome.equals(existente.getNome())) {
            existente.setNome(nome);
            repo.save(existente);
        }
    }
}
