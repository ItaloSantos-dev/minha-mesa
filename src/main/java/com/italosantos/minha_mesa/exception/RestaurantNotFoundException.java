package com.italosantos.minha_mesa.exception;

public class RestaurantNotFoundException extends RuntimeException {
    public RestaurantNotFoundException() {
        super("O restaurante buscado não foi encontrado");
    }

    public RestaurantNotFoundException(Integer id){
        super("O restaurante de id " + id + " não foi encontrado");
    }
}
