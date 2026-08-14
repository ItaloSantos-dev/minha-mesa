package com.italosantos.minha_mesa.exception;

public class RequestRateLimitExceededException extends RuntimeException {
    public RequestRateLimitExceededException(String message) {
        super(message);
    }

    public RequestRateLimitExceededException(){
        super("Quantidade máxima de requisições atingida");
    }
}
