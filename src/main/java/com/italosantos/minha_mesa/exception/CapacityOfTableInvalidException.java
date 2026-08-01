package com.italosantos.minha_mesa.exception;

public class CapacityOfTableInvalidException extends RuntimeException {
    public CapacityOfTableInvalidException() {
        super("A capacidade da mesa não pode ser menor que 1");
    }
}
