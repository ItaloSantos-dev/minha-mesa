package com.italosantos.minha_mesa.exception;

public class UserIsNotOwnerException extends RuntimeException {
    public UserIsNotOwnerException() {
        super("Você não possui nenhum restaurante cadastrado");
    }
}
