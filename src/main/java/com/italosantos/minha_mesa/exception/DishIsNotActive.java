package com.italosantos.minha_mesa.exception;

public class DishIsNotActive extends RuntimeException {
    public DishIsNotActive() {
        super("Este prato não esá disponível atualmente.");
    }
}
