package com.italosantos.minha_mesa.exception;

public class DateOfReserveIsInvalidException extends RuntimeException {
    public DateOfReserveIsInvalidException(){
        super("A data de reserva está inválida");
    }
    public DateOfReserveIsInvalidException(String message) {
        super(message);
    }
}
