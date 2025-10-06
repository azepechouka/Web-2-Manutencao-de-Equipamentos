package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;  
import java.time.LocalDateTime;      

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp; 
import org.hibernate.annotations.UpdateTimestamp;  

@Entity
@Table(name = "usuarios",
       uniqueConstraints = {
         @UniqueConstraint(name = "uk_usuarios_email", columnNames = "email"),
         @UniqueConstraint(name = "uk_usuarios_cpf",   columnNames = "cpf")
       })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(of = "id")
public class Usuario {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String nome;
    @Column(nullable = false) private String email;
    private String cpf;
    private String telefone;
    private LocalDate dataNascimento;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "perfil_id", nullable = false)
    private Perfil perfil;

    @Column(nullable = false) private String senhaSalt;
    @Column(nullable = false) private String senhaHash;

    @Builder.Default
    private boolean ativo = true;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Endereco> enderecos = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;
}
