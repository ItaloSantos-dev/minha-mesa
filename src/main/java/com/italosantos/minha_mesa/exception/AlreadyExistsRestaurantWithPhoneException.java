package com.italosantos.minha_mesa.exception;

public class AlreadyExistsRestaurantWithPhoneException extends RuntimeException {
    public AlreadyExistsRestaurantWithPhoneException() {
        super("Já existe um restaurante cadastrado com esse telefone");
    }
}
