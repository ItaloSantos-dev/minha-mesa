package com.italosantos.minha_mesa.model.enums;

public enum ReserveStatus {
    SCHEDULED("SCHEDULED"),
    CONFIRMED("CONFIRMED"),
    CANCELED("CANCELED"),
    COMPLETED("COMPLETED"),
    NO_SHOW("NO-SHOW");

    private final String reserveStatus;

    ReserveStatus(String reserveStatus) {
        this.reserveStatus = reserveStatus;
    }

    public String getReserveStatus() {
        return reserveStatus;
    }
}
