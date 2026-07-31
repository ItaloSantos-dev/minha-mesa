package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.schedule_exception.CreateScheduleExceptionDTO;
import com.italosantos.minha_mesa.exception.AlreadyExistsScheduleExceptionException;
import com.italosantos.minha_mesa.exception.AlreadyExistsThisWorkingScheduleException;
import com.italosantos.minha_mesa.exception.IllegalParameterException;
import com.italosantos.minha_mesa.exception.UserIsNotOwnerException;
import com.italosantos.minha_mesa.mapper.ScheduleExceptionMapper;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.ScheduleExceptionModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.repository.OwnerRepository;
import com.italosantos.minha_mesa.repository.ScheduleExceptionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ScheduleExceptionService {
    private final ScheduleExceptionRepository scheduleExceptionRepository;
    private final ScheduleExceptionMapper scheduleExceptionMapper;
    private final OwnerRepository ownerRepository;

    public ScheduleExceptionService(ScheduleExceptionRepository scheduleExceptionRepository, ScheduleExceptionMapper scheduleExceptionMapper, OwnerRepository ownerRepository) {
        this.scheduleExceptionRepository = scheduleExceptionRepository;
        this.scheduleExceptionMapper = scheduleExceptionMapper;
        this.ownerRepository = ownerRepository;
    }

    public ScheduleExceptionModel createscheduleExceptionModel(CreateScheduleExceptionDTO createScheduleExceptionDTO, UserModel userModel){
        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(UserIsNotOwnerException::new);
        if (createScheduleExceptionDTO.date().isBefore(LocalDate.now()))
            throw new IllegalParameterException("A data não pode ser antes da atual");

        if (this.scheduleExceptionRepository.existsByDateAndRestaurantModelId(createScheduleExceptionDTO.date(), ownerModel.getRestaurantModel().getId()))
            throw new AlreadyExistsScheduleExceptionException();

        if (createScheduleExceptionDTO.reason().isBlank())
            throw new IllegalParameterException("Você deve explicar o motivo");

        ScheduleExceptionModel scheduleExceptionModel = this.scheduleExceptionMapper.createToModel(createScheduleExceptionDTO, ownerModel.getRestaurantModel());
        return this.scheduleExceptionRepository.save(scheduleExceptionModel);

    }
}
