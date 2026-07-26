package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReserveRepository extends JpaRepository<ReserveModel, Integer> {
    boolean existsByTableModelIdAndDateAndTimeStartAndTimeEndAndStatus(
            Integer tableModelId,
            LocalDate date,
            LocalTime timeStart,
            LocalTime timeEnd,
            ReserveStatus status
    );

    List<ReserveModel> findByUserModelId(Integer id);
    List<ReserveModel> findByTableModelRestaurantModelId(Integer id);

    Optional<ReserveModel> findByIdAndTableModelRestaurantModelId(Integer id, Integer restaurantId);

}
