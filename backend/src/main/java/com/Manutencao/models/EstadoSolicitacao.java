package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estados_solicitacao")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class EstadoSolicitacao {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 40, unique = true)
  private String nome;
}
