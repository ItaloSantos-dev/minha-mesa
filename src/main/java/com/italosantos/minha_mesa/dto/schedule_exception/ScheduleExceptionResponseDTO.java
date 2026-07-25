package com.italosantos.minha_mesa.dto.schedule_exception;

import java.time.LocalDate;

public record ScheduleExceptionResponseDTO(
        Integer id,
        LocalDate date,
        String reason
) {
}
