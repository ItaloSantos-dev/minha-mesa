package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.ReserveDishModel;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface ReserveDishRepository extends JpaRepository<ReserveDishModel, Integer> {
    Boolean existsByReserveModelIdAndDishModelId(Integer reserveId, Integer dishId);

    Optional<ReserveDishModel> findByIdAndReserveModelUserModelId(Integer id, Integer userModelId);
}
