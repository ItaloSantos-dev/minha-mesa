package com.italosantos.minha_mesa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Table(name = "tb_dish_category")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DishCategoryModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private RestaurantModel restaurantModel;

    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @Column(name = "active", nullable = false)
    private Boolean active;

    @Column(name = "slug", nullable = false)
    private String slug;

    @OneToMany(mappedBy = "dishCategoryModel")
    private List<DishModel> dishModels = new ArrayList<>();

}
