package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    Page<ReserveModel> findByUserModelId(Integer id, Pageable pageable);
    Page<ReserveModel> findByTableModelRestaurantModelId(Integer id, Pageable pageable);

    Optional<ReserveModel> findByIdAndTableModelRestaurantModelId(Integer id, Integer restaurantId);
    Optional<ReserveModel> findByIdAndUserModelId(Integer id, Integer userId);

}
