package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.reserve.CreateReserveRequestDTO;
import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.exception.IllegalParameterException;
import com.italosantos.minha_mesa.exception.ResourceNotFoundException;
import com.italosantos.minha_mesa.exception.TableOfReserveIsOcupedException;
import com.italosantos.minha_mesa.exception.ThisDateOfReserveIsNotPermitedException;
import com.italosantos.minha_mesa.mapper.ReserveMapper;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.ScheduleExceptionModel;
import com.italosantos.minha_mesa.model.TableModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.enums.DayOfWeek;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import com.italosantos.minha_mesa.repository.ReserveRepository;
import com.italosantos.minha_mesa.repository.ScheduleExceptionRepository;
import com.italosantos.minha_mesa.repository.TableRepository;
import com.italosantos.minha_mesa.repository.WorkingScheduleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Service
public class ReserveService {
    private final ReserveRepository reserveRepository;
    private final TableRepository tableRepository;
    private final ScheduleExceptionRepository scheduleExceptionRepository;
    private final WorkingScheduleRepository workingScheduleRepository;
    private final ReserveMapper reserveMapper;

    public ReserveService(ReserveRepository reserveRepository, TableRepository tableRepository, ScheduleExceptionRepository scheduleExceptionRepository, WorkingScheduleRepository workingScheduleRepository, ReserveMapper reserveMapper) {
        this.reserveRepository = reserveRepository;
        this.tableRepository = tableRepository;
        this.scheduleExceptionRepository = scheduleExceptionRepository;
        this.workingScheduleRepository = workingScheduleRepository;
        this.reserveMapper = reserveMapper;
    }

    private void validateParams(
            CreateReserveRequestDTO createReserveRequestDTO,
            TableModel tableModel
    ){
        if (this.reserveRepository.existsByTableModelIdAndDateAndTimeStartAndTimeEndAndStatus(
                tableModel.getId(),
                createReserveRequestDTO.date(),
                createReserveRequestDTO.timeStart(),
                createReserveRequestDTO.timeEnd(),
                ReserveStatus.SCHEDULED
        ))
            throw new TableOfReserveIsOcupedException();

        Optional<ScheduleExceptionModel> scheduleExceptionModel = this.scheduleExceptionRepository.findByDateAndRestaurantModelId(createReserveRequestDTO.date(), tableModel.getRestaurantModel().getId());

        if (!tableModel.getActive())
            throw new IllegalParameterException();

        if (scheduleExceptionModel.isPresent())
            throw new ThisDateOfReserveIsNotPermitedException(scheduleExceptionModel.get());

        if (!this.workingScheduleRepository.existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(
                tableModel.getRestaurantModel().getId(),
                DayOfWeek.valueOf(createReserveRequestDTO.date().getDayOfWeek().toString()),
                createReserveRequestDTO.timeStart(),
                createReserveRequestDTO.timeEnd()
        ))
            throw new ThisDateOfReserveIsNotPermitedException();

        if (tableModel.getCapacity()< createReserveRequestDTO.peoples())
            throw new IllegalParameterException("O número de pessoas não pode ser maior que a capacidade da mesa");

        if (createReserveRequestDTO.date().isBefore(LocalDate.now()))
            throw new IllegalParameterException("A data não pode ser anterior á atual");

        if (createReserveRequestDTO.timeEnd().isBefore(createReserveRequestDTO.timeStart()))
            throw new IllegalParameterException("A hora do fim não pode ser antes da hora do início");

    }

    public ReserveModel createReserve(CreateReserveRequestDTO createReserveRequestDTO, UserModel userModel){
        TableModel tableModel = this.tableRepository.findById(createReserveRequestDTO.tableId())
                .orElseThrow(ResourceNotFoundException::new);
        this.validateParams(createReserveRequestDTO, tableModel );
        ReserveModel reserveModel = this.reserveMapper.createToModel(createReserveRequestDTO, tableModel, userModel);
        return this.reserveRepository.save(reserveModel);
    }
}
