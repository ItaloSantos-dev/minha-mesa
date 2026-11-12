package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.DishModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepository extends JpaRepository<DishModel, Integer> {

    List<DishModel> findAllByDishCategoryModelId(Integer id);
    Boolean existsByNameAndRestaurantModelId(String name, Integer categoryModelId);
    List<DishModel> findTop5ByRestaurantModelIdAndActiveTrueOrderByRatingDesc(Integer restaurantId);
}
