package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.DishModel;
import com.italosantos.minha_mesa.model.RateDishModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RateDishRepository extends JpaRepository<RateDishModel, Integer> {
    Boolean existsByReserveDishModelId(Integer id);
    List<RateDishModel> findTop5ByReserveDishModelDishModelRestaurantModelIdAndReserveDishModelDishModelActiveTrueOrderByRatingDesc(Integer restaurantId);

}
