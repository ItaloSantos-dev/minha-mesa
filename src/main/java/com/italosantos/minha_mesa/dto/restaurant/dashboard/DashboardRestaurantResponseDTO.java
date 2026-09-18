package com.italosantos.minha_mesa.dto.restaurant.dashboard;

public record DashboardRestaurantResponseDTO(
        Long totalReservations,
        Long scheduledReservations,
        Long confirmedReservations,
        Long completedReservations,
        Long canceledReservations,
        Long noShowReservations,
        Long totalTables,
        Long activeTables,
        Long totalCapacity,
        Long totalCustomers
) {
}
