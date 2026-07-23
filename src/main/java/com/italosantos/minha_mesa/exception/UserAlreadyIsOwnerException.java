package com.italosantos.minha_mesa.exception;

public class UserAlreadyIsOwnerException extends RuntimeException {
    public UserAlreadyIsOwnerException() {
        super("Este usuário já possui um restaurante");
    }

    public UserAlreadyIsOwnerException(Integer id){
        super("O usuário de id " + id + " já possui um restaurante");
    }

}
