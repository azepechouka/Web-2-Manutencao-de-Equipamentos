package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "perfis")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EqualsAndHashCode(of = "id")
public class Perfil {

    @Id
    private Integer id;

    @Column(nullable = false, unique = true, length = 32)
    private String nome; 
}
