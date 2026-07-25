package com.italosantos.minha_mesa.exception;

import com.italosantos.minha_mesa.model.ScheduleExceptionModel;

public class ThisDateOfReserveIsNotPermitedException extends RuntimeException {
    public ThisDateOfReserveIsNotPermitedException() {
        super("Essa data não está disponível para reservas");
    }

    public ThisDateOfReserveIsNotPermitedException (ScheduleExceptionModel scheduleExceptionModel){
        super("A data " + scheduleExceptionModel.getDate() + " não está disponível para reservas. MOTIVO: " + scheduleExceptionModel.getReason());
    }
}
