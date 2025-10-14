package com.Manutencao.repositories;

import com.Manutencao.models.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);

    Optional<Usuario> findByEmail(String email);
    @EntityGraph(attributePaths = "perfil")
    @Query("select u from Usuario u where lower(u.email) = lower(:email)")
    Optional<Usuario> findByEmailAndFetchPerfilEagerly(@Param("email") String email);
}
