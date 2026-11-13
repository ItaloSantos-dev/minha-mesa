package com.italosantos.minha_mesa.exception;

public class AlreadyExistsReserveDishWithReserveAndDishException extends RuntimeException {
    public AlreadyExistsReserveDishWithReserveAndDishException() {
        super("Já existe um cadastro desse prato para essa reserva.");
    }
}
