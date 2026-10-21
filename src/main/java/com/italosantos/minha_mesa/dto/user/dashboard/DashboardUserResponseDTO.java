package com.italosantos.minha_mesa.dto.user.dashboard;

import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.RestaurantResponseDTO;

import java.util.List;

public record DashboardUserResponseDTO(
        List<RestaurantResponseDTO> recentRestaurants,
        List<ReserveResponseDTO> reservesToday
) {
}