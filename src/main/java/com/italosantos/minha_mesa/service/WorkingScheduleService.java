package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.working_schedule.CreateWorkingScheduleResquestDTO;
import com.italosantos.minha_mesa.exception.AlreadyExistsThisWorkingScheduleException;
import com.italosantos.minha_mesa.exception.RestaurantNotFoundException;
import com.italosantos.minha_mesa.mapper.WorkingScheduleMapper;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.WorkingScheduleModel;
import com.italosantos.minha_mesa.repository.RestaurantRepository;
import com.italosantos.minha_mesa.repository.WorkingScheduleRepository;
import org.springframework.stereotype.Service;

@Service
public class WorkingScheduleService {
    private final WorkingScheduleRepository workingScheduleRepository;
    private final RestaurantRepository restaurantRepository;
    private final WorkingScheduleMapper workingScheduleMapper;

    public WorkingScheduleService(WorkingScheduleRepository workingScheduleRepository, RestaurantRepository restaurantRepository, WorkingScheduleMapper workingScheduleMapper) {
        this.workingScheduleRepository = workingScheduleRepository;
        this.restaurantRepository = restaurantRepository;
        this.workingScheduleMapper = workingScheduleMapper;
    }

    public WorkingScheduleModel createWorkingSchedule(UserModel userModel, CreateWorkingScheduleResquestDTO createWorkingScheduleResquestDTO){
        RestaurantModel restaurantModel = this.restaurantRepository.findByOwnerModelUserModelId(userModel.getId())
                .orElseThrow(RestaurantNotFoundException::new);

        if (this.workingScheduleRepository.existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(
                restaurantModel.getId(),
                createWorkingScheduleResquestDTO.dayOfWeek(),
                createWorkingScheduleResquestDTO.timeStart(),
                createWorkingScheduleResquestDTO.timeEnd()
        ))
            throw new AlreadyExistsThisWorkingScheduleException(createWorkingScheduleResquestDTO.dayOfWeek(), createWorkingScheduleResquestDTO.timeStart(),createWorkingScheduleResquestDTO.timeEnd());

        WorkingScheduleModel workingScheduleModel = this.workingScheduleMapper.createToModel(createWorkingScheduleResquestDTO, restaurantModel);
        return this.workingScheduleRepository.save(workingScheduleModel);
    }
}
