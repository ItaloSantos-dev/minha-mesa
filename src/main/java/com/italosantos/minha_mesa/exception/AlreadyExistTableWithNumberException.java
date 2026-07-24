package com.italosantos.minha_mesa.exception;

public class AlreadyExistTableWithNumberException extends RuntimeException {
    public AlreadyExistTableWithNumberException() {
        super("Já existe uma mesa com essa numeração");
    }
}
