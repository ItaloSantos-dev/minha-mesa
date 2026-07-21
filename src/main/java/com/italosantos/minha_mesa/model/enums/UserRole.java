package com.italosantos.minha_mesa.model.enums;

public enum UserRole {
    USER("USER"),
    OWNER("OWNER");

    private String role;

    UserRole(String role){
        this.role = role;
    }

    String getRole(){
        return this.role;
    }
}
