package com.italosantos.minha_mesa.exception;

public class AlreadyExistsCategoryOfRestaurantWithNameException extends RuntimeException {
    public AlreadyExistsCategoryOfRestaurantWithNameException(String message) {
        super(message);
    }
    public AlreadyExistsCategoryOfRestaurantWithNameException(){
      super("Já existe uma categoria com este nome cadastrado em seu restaurante.");
    }
}
