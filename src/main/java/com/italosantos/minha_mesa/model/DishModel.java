package com.italosantos.minha_mesa.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Table(name = "tb_dish")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DishModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private DishCategoryModel dishCategoryModel;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private RestaurantModel restaurantModel;

    @Column(name = "description")
    private String description;

    @Column(name = "preparation_time", nullable = false)
    private Integer preparationTime; //seconds

    @DecimalMax("5.0")
    @Column(name = "rating", scale = 2, precision = 1)
    private BigDecimal rating;

    @DecimalMin("0.1")
    @Column(name = "price", scale = 10, precision = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "slug", nullable = false)
    private String slug;

    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @Column(name = "active", nullable = false)
    private Boolean active;

    @OneToMany(mappedBy = "dishModel")
    private List<ReserveDishModel> reserveDishModels;

    public void updateRating(){
        BigDecimal rateCount = BigDecimal.ZERO;
        BigDecimal rateTotal = BigDecimal.ZERO;
        for (ReserveDishModel reserveDishModel : this.reserveDishModels){
            if (reserveDishModel.getRateDishModel()!=null){
                rateCount = rateCount.add(BigDecimal.ONE);
                rateTotal = rateTotal.add(BigDecimal.valueOf(reserveDishModel.getRateDishModel().getRating()));
            }
        }

        if (rateCount.compareTo(BigDecimal.ZERO) == 0) {
            System.out.println("Sem novo rating");

            this.rating = null;
            return;
        }

        BigDecimal avgRating = rateTotal.divide(rateCount, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(2))
                .setScale(0, RoundingMode.HALF_UP)
                .divide(BigDecimal.valueOf(2));
        System.out.println("Novo rating: " + avgRating);
        this.rating = avgRating;


    }



}
