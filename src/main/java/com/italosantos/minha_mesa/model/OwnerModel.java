package com.italosantos.minha_mesa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Table(name = "tb_owner")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OwnerModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(mappedBy = "ownerModel")
    private RestaurantModel restaurantModel;

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserModel userModel;

    @Column(name = "cpf", nullable = false, unique = true)
    private String cpf;

    @Column(name = "nasciment", nullable = false)
    private LocalDate nasciment;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}
