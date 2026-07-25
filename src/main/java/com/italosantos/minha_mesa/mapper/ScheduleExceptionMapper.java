package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.schedule_exception.CreateScheduleExceptionDTO;
import com.italosantos.minha_mesa.dto.schedule_exception.ScheduleExceptionResponseDTO;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.model.ScheduleExceptionModel;
import org.springframework.stereotype.Component;

@Component
public class ScheduleExceptionMapper {
    public ScheduleExceptionModel createToModel (CreateScheduleExceptionDTO createScheduleExceptionDTO, RestaurantModel restaurantModel){
        ScheduleExceptionModel scheduleExceptionModel = new ScheduleExceptionModel();
        scheduleExceptionModel.setDate(createScheduleExceptionDTO.date());
        scheduleExceptionModel.setReason(createScheduleExceptionDTO.reason());
        scheduleExceptionModel.setRestaurantModel(restaurantModel);
        return scheduleExceptionModel;
    }

    public ScheduleExceptionResponseDTO modelToResponse(ScheduleExceptionModel scheduleExceptionModel){
        return new ScheduleExceptionResponseDTO(
                scheduleExceptionModel.getId(),
                scheduleExceptionModel.getDate(),
                scheduleExceptionModel.getReason()
        );
    }
}
