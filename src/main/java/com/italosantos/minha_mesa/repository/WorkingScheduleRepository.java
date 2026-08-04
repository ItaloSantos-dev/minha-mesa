package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.WorkingScheduleModel;
import com.italosantos.minha_mesa.model.enums.DayOfWeek;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface WorkingScheduleRepository extends JpaRepository<WorkingScheduleModel, Integer> {
    boolean existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(
            Integer restaurantId,
            DayOfWeek dayOfWeek,
            LocalTime timeStart,
            LocalTime timeEnd
    );

    Page<WorkingScheduleModel> findByRestaurantModelId(Integer id, Pageable pageable);
}
