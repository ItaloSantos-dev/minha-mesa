package com.italosantos.minha_mesa.exception;

public class UploadMediaException extends RuntimeException {
    public UploadMediaException(String message) {
        super(message);
    }

    public UploadMediaException(){super("Não foi possível fazer upload do arquivo!");}
}
