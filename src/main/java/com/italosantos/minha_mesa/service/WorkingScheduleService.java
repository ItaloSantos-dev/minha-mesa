package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.working_schedule.CreateWorkingScheduleResquestDTO;
import com.italosantos.minha_mesa.dto.working_schedule.WorkingScheduleResponseDTO;
import com.italosantos.minha_mesa.exception.*;
import com.italosantos.minha_mesa.mapper.WorkingScheduleMapper;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.WorkingScheduleModel;
import com.italosantos.minha_mesa.repository.OwnerRepository;
import com.italosantos.minha_mesa.repository.RestaurantRepository;
import com.italosantos.minha_mesa.repository.WorkingScheduleRepository;
import org.springframework.stereotype.Service;

@Service
public class WorkingScheduleService {
    private final WorkingScheduleRepository workingScheduleRepository;
    private final RestaurantRepository restaurantRepository;
    private final WorkingScheduleMapper workingScheduleMapper;
    private final OwnerRepository ownerRepository;

    public WorkingScheduleService(WorkingScheduleRepository workingScheduleRepository, RestaurantRepository restaurantRepository, WorkingScheduleMapper workingScheduleMapper, OwnerRepository ownerRepository) {
        this.workingScheduleRepository = workingScheduleRepository;
        this.restaurantRepository = restaurantRepository;
        this.workingScheduleMapper = workingScheduleMapper;
        this.ownerRepository = ownerRepository;
    }

    public WorkingScheduleResponseDTO createWorkingSchedule(UserModel userModel, CreateWorkingScheduleResquestDTO createWorkingScheduleResquestDTO){
        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(UserIsNotOwnerException::new);

        if (createWorkingScheduleResquestDTO.timeStart().isAfter(createWorkingScheduleResquestDTO.timeEnd()))
            throw new TimeIsInvalidException("A hora de fim não pode ser antes da hora de ínicio");

        if (this.workingScheduleRepository.existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(
                ownerModel.getRestaurantModel().getId(),
                createWorkingScheduleResquestDTO.dayOfWeek(),
                createWorkingScheduleResquestDTO.timeStart(),
                createWorkingScheduleResquestDTO.timeEnd()
        ))
            throw new AlreadyExistsThisWorkingScheduleException(createWorkingScheduleResquestDTO.dayOfWeek(), createWorkingScheduleResquestDTO.timeStart(),createWorkingScheduleResquestDTO.timeEnd());

        WorkingScheduleModel workingScheduleModel = this.workingScheduleMapper.createToModel(createWorkingScheduleResquestDTO, ownerModel.getRestaurantModel());
        return this.workingScheduleMapper.modelToResponse(this.workingScheduleRepository.save(workingScheduleModel));
    }

    public void deleteWorkingScheduleById(UserModel userModel, Integer id){
        WorkingScheduleModel workingScheduleModel = this.workingScheduleRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);
        if (! workingScheduleModel.getRestaurantModel().getOwnerModel().getUserModel().getId().equals(userModel.getId()))
            throw new NotPermitedException();
        this.workingScheduleRepository.deleteById(id);

    }
}
