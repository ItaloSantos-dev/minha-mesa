package com.italosantos.minha_mesa.dto.reserve;

import com.italosantos.minha_mesa.model.enums.DayOfWeek;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReserveResponseDTO(
        Integer id,
        String clientName,
        String restaurantName,
        LocalDate date,
        DayOfWeek dayOfWeek,
        LocalTime timeStart,
        LocalTime timeEnd,
        ReserveStatus status,
        String observation,
        Integer peoples
) {
}
