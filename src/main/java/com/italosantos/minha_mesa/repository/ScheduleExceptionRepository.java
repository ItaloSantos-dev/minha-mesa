package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.ScheduleExceptionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ScheduleExceptionRepository  extends JpaRepository<ScheduleExceptionModel, Integer> {
    boolean existsByDateAndRestaurantModelId (LocalDate date, Integer restaurantId);

    Optional<ScheduleExceptionModel> findByDateAndRestaurantModelId (LocalDate date, Integer restaurantId);
}
