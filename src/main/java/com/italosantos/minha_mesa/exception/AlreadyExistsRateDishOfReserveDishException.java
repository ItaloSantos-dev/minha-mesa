package com.italosantos.minha_mesa.exception;

public class AlreadyExistsRateDishOfReserveDishException extends RuntimeException {
    public AlreadyExistsRateDishOfReserveDishException() {
        super("Já existe uma avaliação para este pedido");
    }
}
