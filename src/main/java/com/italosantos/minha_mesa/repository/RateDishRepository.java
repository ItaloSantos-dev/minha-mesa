package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.RateDishModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RateDishRepository extends JpaRepository<RateDishModel, Integer> {
    Boolean existsByReserveDishModelId(Integer id);
}
