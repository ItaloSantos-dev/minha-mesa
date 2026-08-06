package com.italosantos.minha_mesa.exception;

public class RestaurantAlreadyHasDesactiveException extends RuntimeException {
    public RestaurantAlreadyHasDesactiveException() {
        super("Seu restaurante ja está desativado");
    }
}
