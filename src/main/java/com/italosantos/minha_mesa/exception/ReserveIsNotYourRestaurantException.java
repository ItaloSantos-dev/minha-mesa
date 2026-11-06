package com.italosantos.minha_mesa.exception;

public class ReserveIsNotYourRestaurantException extends RuntimeException {
    public ReserveIsNotYourRestaurantException(){super("Esta reserva não pertence a seu restaurante.");}
}
