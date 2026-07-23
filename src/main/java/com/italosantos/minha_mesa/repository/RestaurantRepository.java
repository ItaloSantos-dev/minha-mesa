package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.RestaurantModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRepository extends JpaRepository<RestaurantModel, Integer> {
    boolean existsByOwnerModelUserModelId(Integer userId);
}
