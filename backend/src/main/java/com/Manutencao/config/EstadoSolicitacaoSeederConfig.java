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
        upsert(repo, "ABERTA",         "ABERTA");
        upsert(repo, "ORCADA",         "ORÇADA");
        upsert(repo, "APROVADA",       "APROVADA");
        upsert(repo, "REJEITADA",      "REJEITADA");
        upsert(repo, "REDIRECIONADA",  "REDIRECIONADA");
        upsert(repo, "ARRUMADA",       "ARRUMADA");
        upsert(repo, "PAGA",           "PAGA");
        upsert(repo, "FINALIZADA",     "FINALIZADA");
    }

    private void upsert(EstadoSolicitacaoRepository repo, String id, String descricao) {
        repo.findById(id).orElseGet(() ->
            repo.save(EstadoSolicitacao.builder()
                .id(id)
                .descricao(descricao)
                .build()
            )
        );
    }
}
