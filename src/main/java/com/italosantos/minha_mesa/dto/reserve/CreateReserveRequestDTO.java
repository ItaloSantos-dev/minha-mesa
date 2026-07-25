package com.italosantos.minha_mesa.dto.reserve;

import java.time.LocalDate;
import java.time.LocalTime;

public record CreateReserveRequestDTO(
        Integer tableId,
        LocalDate date,
        LocalTime timeStart,
        LocalTime timeEnd,
        Integer peoples,
        String observation
) {
}
