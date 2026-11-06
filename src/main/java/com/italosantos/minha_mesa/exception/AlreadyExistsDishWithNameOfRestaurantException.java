package com.italosantos.minha_mesa.exception;

public class AlreadyExistsDishWithNameOfRestaurantException extends RuntimeException {
    public AlreadyExistsDishWithNameOfRestaurantException() {
        super("Já existe um prato com este nome cadastrado com seu restaurante.");
    }
}
