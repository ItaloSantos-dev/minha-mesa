package com.italosantos.minha_mesa.exception;

public class IllegalParameterException extends RuntimeException {
    public IllegalParameterException() {
        super("Algum parametro está inválido");
    }

    public IllegalParameterException(String menssage) {
        super(menssage);
    }
}
