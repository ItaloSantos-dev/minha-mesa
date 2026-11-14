package com.italosantos.minha_mesa.exception;

public class AlreadyExistsRestaurantWithNameException extends RuntimeException {
    public AlreadyExistsRestaurantWithNameException() {
        super("Já existe um restaurante cadastrado com esse nome!");
    }
}
