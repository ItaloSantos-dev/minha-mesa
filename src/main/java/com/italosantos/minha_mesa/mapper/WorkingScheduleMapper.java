package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.working_schedule.CreateWorkingScheduleResquestDTO;
import com.italosantos.minha_mesa.dto.working_schedule.WorkingScheduleResponseDTO;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.model.WorkingScheduleModel;
import org.springframework.stereotype.Component;

@Component
public class WorkingScheduleMapper {
    public WorkingScheduleModel createToModel(CreateWorkingScheduleResquestDTO createWorkingScheduleResquestDTO, RestaurantModel restaurantModel){
        WorkingScheduleModel workingScheduleModel = new WorkingScheduleModel();
        workingScheduleModel.setDayOfWeek(createWorkingScheduleResquestDTO.dayOfWeek());
        workingScheduleModel.setRestaurantModel(restaurantModel);
        workingScheduleModel.setTimeStart(createWorkingScheduleResquestDTO.timeStart());
        workingScheduleModel.setTimeEnd(createWorkingScheduleResquestDTO.timeEnd());
        return workingScheduleModel;
    }

    public WorkingScheduleResponseDTO modelToResponse(WorkingScheduleModel workingScheduleModel){
        return new WorkingScheduleResponseDTO(
                workingScheduleModel.getId(),
                workingScheduleModel.getDayOfWeek(),
                workingScheduleModel.getTimeStart(),
                workingScheduleModel.getTimeEnd()
        );
    }
}
