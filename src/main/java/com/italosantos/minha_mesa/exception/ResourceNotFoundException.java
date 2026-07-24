package com.italosantos.minha_mesa.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException() {
        super("Não foi encontrado nenhum item com esse id");
    }
}
