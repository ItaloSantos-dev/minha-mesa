package com.italosantos.minha_mesa.dto.restaurant.dashboard.real_time_tables_data;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

public record RealTimeTablesData(
        Long tablesOccupied,
        Long tablesFree,
        OffsetDateTime dataAndTimeFetchedAt
) {
}
