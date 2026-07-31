package com.italosantos.minha_mesa.exception;

public class AlreadyExistsScheduleExceptionException extends RuntimeException {
    public AlreadyExistsScheduleExceptionException() {
        super("Já existe uma exceção para essa data");
    }
}
