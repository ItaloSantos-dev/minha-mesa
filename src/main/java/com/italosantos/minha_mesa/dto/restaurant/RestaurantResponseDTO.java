package com.italosantos.minha_mesa.dto.restaurant;

import com.italosantos.minha_mesa.dto.working_schedule.WorkingScheduleResponseDTO;

import java.util.List;

public record RestaurantResponseDTO(
        Integer id,
        String name,
        String phone,
        String address,
        Boolean active,
        List<WorkingScheduleResponseDTO> workingDays
) {
}
