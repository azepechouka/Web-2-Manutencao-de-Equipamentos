package com.Manutencao.api.dto;

import com.Manutencao.models.HistoricoSolicitacao;
import java.time.Instant;

public class HistoricoStatusResponse {

    private Long id;
    private String statusNome;
    private String nomeUsuario;
    private String observacao;
    private Instant criadoEm;

    public static HistoricoStatusResponse from(HistoricoSolicitacao entity) {
        HistoricoStatusResponse dto = new HistoricoStatusResponse();
        dto.id = entity.getId();
        dto.statusNome = entity.getParaEstado() != null
                ? entity.getParaEstado().getNome()
                : null;

        dto.nomeUsuario = entity.getUsuario() != null
                ? entity.getUsuario().getNome()
                : "Sistema";

        dto.observacao = entity.getObservacao();

        dto.criadoEm = entity.getCriadoEm();

        return dto;
    }

    // Getters e setters
    public Long getId() { return id; }
    public String getStatusNome() { return statusNome; }
    public String getNomeUsuario() { return nomeUsuario; }
    public String getObservacao() { return observacao; }
    public Instant getCriadoEm() { return criadoEm; }

    public void setId(Long id) { this.id = id; }
    public void setStatusNome(String statusNome) { this.statusNome = statusNome; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
    public void setCriadoEm(Instant criadoEm) { this.criadoEm = criadoEm; }
}
