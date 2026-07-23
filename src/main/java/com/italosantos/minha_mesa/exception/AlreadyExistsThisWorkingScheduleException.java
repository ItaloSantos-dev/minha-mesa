package com.italosantos.minha_mesa.exception;

import com.italosantos.minha_mesa.model.enums.DayOfWeek;

import java.time.LocalTime;

public class AlreadyExistsThisWorkingScheduleException extends RuntimeException {
    public AlreadyExistsThisWorkingScheduleException() {
        super("Já existe um horario cadastrado com esses valores");
    }

    public AlreadyExistsThisWorkingScheduleException(
            DayOfWeek dayOfWeek,
            LocalTime timeStart,
            LocalTime timeEnd
    ){
        super("Já existe um horário cadastrado para " + dayOfWeek + " das " + timeStart + " às " + timeEnd);
    }
}
