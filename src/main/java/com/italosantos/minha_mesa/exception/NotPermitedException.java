package com.italosantos.minha_mesa.exception;

public class NotPermitedException extends RuntimeException {
    public NotPermitedException() {
        super("Você não possui permissão para realizar esta ação");
    }
    public NotPermitedException (String menssage){
        super(menssage);
    }
}
