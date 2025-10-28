package com.Manutencao.service;

import com.Manutencao.repositories.OrcamentoRepository;
import com.Manutencao.repositories.SolicitacaoRepository;
import com.Manutencao.repositories.UsuarioRepository;
import com.Manutencao.repositories.EquipamentoRepository;
import com.Manutencao.repositories.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RelatorioService {

    private final OrcamentoRepository orcamentoRepo;
    private final SolicitacaoRepository solicitacaoRepo;
    private final UsuarioRepository usuarioRepo;
    private final EquipamentoRepository equipamentoRepo;
    private final CategoriaRepository categoriaRepo;

    public RelatorioService(OrcamentoRepository orcamentoRepo, SolicitacaoRepository solicitacaoRepo,
                          UsuarioRepository usuarioRepo, EquipamentoRepository equipamentoRepo,
                          CategoriaRepository categoriaRepo) {
        this.orcamentoRepo = orcamentoRepo;
        this.solicitacaoRepo = solicitacaoRepo;
        this.usuarioRepo = usuarioRepo;
        this.equipamentoRepo = equipamentoRepo;
        this.categoriaRepo = categoriaRepo;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> relatorioReceita(LocalDateTime dataInicio, LocalDateTime dataFim) {
        List<Map<String, Object>> resultado = new ArrayList<>();
        
        // Implementação simplificada - em produção seria uma query mais complexa
        Map<String, Object> item = new HashMap<>();
        item.put("periodo", "Período selecionado");
        item.put("totalOrcamentos", orcamentoRepo.count());
        item.put("valorTotal", orcamentoRepo.findAll().stream()
                .mapToDouble(o -> o.getValorTotal().doubleValue())
                .sum());
        
        resultado.add(item);
        return resultado;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> relatorioReceitaPorCategoria(LocalDateTime dataInicio, LocalDateTime dataFim) {
        List<Map<String, Object>> resultado = new ArrayList<>();
        
        // Implementação simplificada - em produção seria uma query com JOIN
        categoriaRepo.findAll().forEach(categoria -> {
            Map<String, Object> item = new HashMap<>();
            item.put("categoriaId", categoria.getId());
            item.put("categoriaNome", categoria.getNome());
            item.put("totalOrcamentos", 0); // Seria calculado com JOIN
            item.put("valorTotal", 0.0); // Seria calculado com JOIN
            resultado.add(item);
        });
        
        return resultado;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> relatorioSolicitacoes(LocalDateTime dataInicio, LocalDateTime dataFim) {
        List<Map<String, Object>> resultado = new ArrayList<>();
        
        Map<String, Object> item = new HashMap<>();
        item.put("totalSolicitacoes", solicitacaoRepo.count());
        item.put("solicitacoesCriadas", solicitacaoRepo.count());
        item.put("solicitacoesOrcadas", 0);
        item.put("solicitacoesAprovadas", 0);
        item.put("solicitacoesRejeitadas", 0);
        item.put("solicitacoesConcluidas", 0);
        
        resultado.add(item);
        return resultado;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> relatorioFuncionarios() {
        List<Map<String, Object>> resultado = new ArrayList<>();
        
        usuarioRepo.findAll().forEach(usuario -> {
            Map<String, Object> item = new HashMap<>();
            item.put("funcionarioId", usuario.getId());
            item.put("funcionarioNome", usuario.getNome());
            item.put("funcionarioEmail", usuario.getEmail());
            item.put("totalSolicitacoes", 0); // Seria calculado
            item.put("totalOrcamentos", 0); // Seria calculado
            item.put("totalManutencoes", 0); // Seria calculado
            resultado.add(item);
        });
        
        return resultado;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> relatorioEquipamentos() {
        List<Map<String, Object>> resultado = new ArrayList<>();
        
        Map<String, Object> item = new HashMap<>();
        item.put("totalEquipamentos", equipamentoRepo.count());
        item.put("equipamentosPorCategoria", new HashMap<>());
        item.put("equipamentosPorCliente", new HashMap<>());
        
        resultado.add(item);
        return resultado;
    }
}
