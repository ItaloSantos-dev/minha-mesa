package com.italosantos.minha_mesa.model.enums;

public enum DayOfWeek {

    MONDAY("MONDAY"),
    TUESDAY("TUESDAY"),
    WEDNESDAY("WEDNESDAY"),
    THURSDAY("THURSDAY"),
    FRIDAY("FRIDAY"),
    SATURDAY("SATURDAY"),
    SUNDAY("SUNDAY");

    private String dayOfWeek;

    DayOfWeek(String dayOfWeek){
        this.dayOfWeek = dayOfWeek;
    }

    String getDayOfWeek(){
        return this.dayOfWeek;
    }


}
