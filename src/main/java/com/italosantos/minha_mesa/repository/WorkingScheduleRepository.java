package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.WorkingScheduleModel;
import com.italosantos.minha_mesa.model.enums.DayOfWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;

@Repository
public interface WorkingScheduleRepository extends JpaRepository<WorkingScheduleModel, Integer> {
    boolean existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(
            Integer restaurantId,
            DayOfWeek dayOfWeek,
            LocalTime timeStart,
            LocalTime timeEnd
    );
}
