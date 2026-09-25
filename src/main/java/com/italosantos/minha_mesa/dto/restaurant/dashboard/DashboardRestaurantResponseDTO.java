package com.italosantos.minha_mesa.dto.restaurant.dashboard;

import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.dashboard.real_time_tables_data.RealTimeTablesData;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record DashboardRestaurantResponseDTO(
        String restaurantName,
        Long totalReservations,
        Long scheduledReservations,
        Long confirmedReservations,
        Long peoplesExpectedInDay,
        List<ReserveResponseDTO> nextReservations,
        Long tablesTotalCount,
        Long tablesActiveCount,
        RealTimeTablesData realTimeTablesData,
        LocalDate dateOfDashboard
) {
}
