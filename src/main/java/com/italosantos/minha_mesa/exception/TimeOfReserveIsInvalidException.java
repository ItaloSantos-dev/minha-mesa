package com.italosantos.minha_mesa.exception;

public class TimeOfReserveIsInvalidException extends RuntimeException {
    public TimeOfReserveIsInvalidException (){
        super("A hora da reserva é inválida");
    }
    public TimeOfReserveIsInvalidException(String message) {
        super(message);
    }
}
