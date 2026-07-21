package com.italosantos.minha_mesa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @OneToMany(mappedBy = "tableModel")
    private List<ReserveModel> reserveModelList = new ArrayList<>();
}
