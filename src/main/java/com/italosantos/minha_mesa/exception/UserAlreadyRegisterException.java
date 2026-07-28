package com.italosantos.minha_mesa.exception;

public class UserAlreadyRegisterException extends RuntimeException {
    public UserAlreadyRegisterException(String message) {
        super(message);
    }
    public UserAlreadyRegisterException(){
        super("Este email ja esta cadastrado");
    }
}
