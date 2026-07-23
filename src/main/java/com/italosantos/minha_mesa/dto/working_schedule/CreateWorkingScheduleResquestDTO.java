package com.italosantos.minha_mesa.dto.working_schedule;

import com.italosantos.minha_mesa.model.enums.DayOfWeek;

import java.time.LocalTime;

public record CreateWorkingScheduleResquestDTO(
        DayOfWeek dayOfWeek,
        LocalTime timeStart,
        LocalTime timeEnd
) {
}
