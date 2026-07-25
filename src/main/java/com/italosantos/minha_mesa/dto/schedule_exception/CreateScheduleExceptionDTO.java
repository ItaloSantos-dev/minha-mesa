package com.italosantos.minha_mesa.dto.schedule_exception;

import java.time.LocalDate;

public record CreateScheduleExceptionDTO(
        LocalDate date,
        String reason
) {
}
