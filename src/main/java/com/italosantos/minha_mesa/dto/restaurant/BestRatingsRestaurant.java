package com.italosantos.minha_mesa.dto.restaurant;

import com.italosantos.minha_mesa.dto.dish.DishResponseDTO;
import com.italosantos.minha_mesa.dto.rate_dish.RateDishResponseDTO;

import java.util.List;

public record BestRatingsRestaurant(
        List<DishResponseDTO> bestDishes,
        List<RateDishResponseDTO> bestRatesDish
) {
}
