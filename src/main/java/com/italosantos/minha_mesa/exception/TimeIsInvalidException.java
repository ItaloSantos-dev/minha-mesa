package com.italosantos.minha_mesa.exception;

public class TimeIsInvalidException extends RuntimeException {
    public TimeIsInvalidException(){
        super("A hora da reserva é inválida");
    }
    public TimeIsInvalidException(String message) {
        super(message);
    }
}
