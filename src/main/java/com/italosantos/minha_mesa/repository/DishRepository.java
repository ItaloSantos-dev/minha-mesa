package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.DishModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepository extends JpaRepository<DishModel, Integer> {

    List<DishModel> findAllByDishCategoryModelId(Integer id);
    List<DishModel> findAllByIdAndDishCategoryModelId(Integer id, Integer categoryModelId);
    Boolean existsByNameAndRestaurantModelId(String name, Integer categoryModelId);
}
