package com.Manutencao.repositories;

import com.Manutencao.models.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    boolean existsByNomeIgnoreCase(String nome);
    boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id);
}
