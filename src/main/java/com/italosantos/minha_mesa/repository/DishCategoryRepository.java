package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.DishCategoryModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DishCategoryRepository extends JpaRepository<DishCategoryModel, Integer> {
    Boolean existsByNameAndRestaurantModelOwnerModelUserModelId(String name, Integer userId);
}
