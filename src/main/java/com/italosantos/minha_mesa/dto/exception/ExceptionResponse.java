package com.italosantos.minha_mesa.dto.exception;

import org.springframework.http.HttpStatus;

public record ExceptionResponse(
        HttpStatus status,
        String menssage
) {
}
