package com.italosantos.minha_mesa.exception;

public class ReserveIsNotInProgressException extends RuntimeException {
    public ReserveIsNotInProgressException() {
        super("Só é possível adicionar pratos a reservas em andamento");
    }
}
