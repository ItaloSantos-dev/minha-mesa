package com.italosantos.minha_mesa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Table(name = "tb_table")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private RestaurantModel restaurantModel;

    @Column(name = "number", nullable = false)
    private Integer number;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "active", nullable = false)
    private Boolean active;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "tableModel")
    private List<ReserveModel> reserveModelList = new ArrayList<>();
}
