package com.italosantos.minha_mesa.exception;

public class TableOfReserveIsOcupedException extends RuntimeException {
    public TableOfReserveIsOcupedException() {
        super("Esta mesa já tem uma reserva cadastrada, tente outra data e hora");
    }
}
