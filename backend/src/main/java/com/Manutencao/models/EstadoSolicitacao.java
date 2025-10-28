package com.Manutencao.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;


@Entity
@Table(name = "estados_solicitacao")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class EstadoSolicitacao {

  @Id
  @Column(length = 20)
  private String id; 

  @Column(nullable = false, length = 40)
  private String descricao;
}
