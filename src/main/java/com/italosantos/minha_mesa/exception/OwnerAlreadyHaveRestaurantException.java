package com.italosantos.minha_mesa.exception;

public class OwnerAlreadyHaveRestaurantException extends RuntimeException {
    public OwnerAlreadyHaveRestaurantException(String message) {
        super(message);
    }
    public OwnerAlreadyHaveRestaurantException(){
    super("Este usuário já possui um restaurante cadastrado");}
}
