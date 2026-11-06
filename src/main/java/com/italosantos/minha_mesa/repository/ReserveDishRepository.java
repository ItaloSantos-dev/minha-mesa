package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.ReserveDishModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReserveDishRepository extends JpaRepository<ReserveDishModel, Integer> {
    Boolean existsByReserveModelIdAndDishModelId(Integer reserveId, Integer dishId);
}
