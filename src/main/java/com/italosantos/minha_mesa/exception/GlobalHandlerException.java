package com.italosantos.minha_mesa.exception;

import com.italosantos.minha_mesa.dto.exception.ExceptionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalHandlerException {
    @ExceptionHandler(UserAlreadyIsOwnerException.class)
    public ResponseEntity<ExceptionResponse> handlerUserAlreadyIsOwner(UserAlreadyIsOwnerException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ExceptionResponse(HttpStatus.CONFLICT, exception.getMessage()));
    }

    @ExceptionHandler(RestaurantNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handlerRestaurantNotFoundException(RestaurantNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptionResponse(HttpStatus.NOT_FOUND, exception.getMessage()));
    }
}
