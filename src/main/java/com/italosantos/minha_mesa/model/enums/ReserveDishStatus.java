package com.italosantos.minha_mesa.model.enums;

public enum ReserveDishStatus {
    PENDING("PENDING"),
    COMPLETED("COMPLETED"),
    CANCELED("CANCELED"),
    PARTIALLY_COMPLETED("PARTIALLY_COMPLETED");

    private final String reserveDishStatus;

    ReserveDishStatus(String reserveDishStatus) {
        this.reserveDishStatus = reserveDishStatus;
    }

    public String getReserveDishStatus() {
        return reserveDishStatus;
    }
}
