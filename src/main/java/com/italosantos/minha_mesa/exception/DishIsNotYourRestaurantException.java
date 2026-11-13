package com.italosantos.minha_mesa.exception;

public class DishIsNotYourRestaurantException extends RuntimeException {
    public DishIsNotYourRestaurantException() {
        super("Este prato não pertence a seu restaurante.");
    }
}
