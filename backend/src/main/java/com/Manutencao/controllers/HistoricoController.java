package com.Manutencao.controllers;

import com.Manutencao.api.dto.HistoricoStatusResponse;
import com.Manutencao.services.HistoricoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico")
@CrossOrigin(origins = "*")
public class HistoricoController {

    private final HistoricoService historicoService;

    public HistoricoController(HistoricoService historicoService) {
        this.historicoService = historicoService;
    }

    @GetMapping("/solicitacao/{id}")
    public List<HistoricoStatusResponse> listarPorSolicitacao(@PathVariable Long id) {
        return historicoService.listarPorSolicitacao(id);
    }
}
