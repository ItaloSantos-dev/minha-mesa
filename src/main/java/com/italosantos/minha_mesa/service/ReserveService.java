package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.reserve.CreateReserveRequestDTO;
import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.dto.reserve.ReserveUpdateResponseDTO;
import com.italosantos.minha_mesa.exception.*;
import com.italosantos.minha_mesa.mapper.ReserveMapper;
import com.italosantos.minha_mesa.model.*;
import com.italosantos.minha_mesa.model.enums.DayOfWeek;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import com.italosantos.minha_mesa.repository.*;
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
    private final OwnerRepository ownerRepository;

    public ReserveService(ReserveRepository reserveRepository, TableRepository tableRepository, ScheduleExceptionRepository scheduleExceptionRepository, WorkingScheduleRepository workingScheduleRepository, ReserveMapper reserveMapper, OwnerRepository ownerRepository) {
        this.reserveRepository = reserveRepository;
        this.tableRepository = tableRepository;
        this.scheduleExceptionRepository = scheduleExceptionRepository;
        this.workingScheduleRepository = workingScheduleRepository;
        this.reserveMapper = reserveMapper;
        this.ownerRepository = ownerRepository;
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

    private void validateNewStatusOfreserve(ReserveModel reserveModel, ReserveStatus newStatus, boolean userIsCliente){
        if (userIsCliente && newStatus!=ReserveStatus.CANCELED)
            throw new NotPermitedException();

        if (!reserveModel.getDate().isAfter(LocalDate.now().plusDays(1)) )
            throw new NotPermitedException("A data limite para cancelamento da reserva expirou");

        if ((newStatus==ReserveStatus.COMPLETED || newStatus==ReserveStatus.NO_SHOW) &&
            reserveModel.getDate().isBefore(LocalDate.now())
        )
            throw new IllegalParameterException("Não possível alterar o status para " + newStatus + " antes da data marcada para reserva");

        ReserveStatus reserveStatus = reserveModel.getStatus();

        if (    reserveStatus==ReserveStatus.CANCELED ||
                reserveStatus==ReserveStatus.NO_SHOW ||
                reserveStatus==ReserveStatus.COMPLETED
        )
            throw new IllegalParameterException("Não é possível alterar o status atual ( " + reserveStatus + " ) da reserva");

        if (reserveStatus==ReserveStatus.SCHEDULED && newStatus==ReserveStatus.NO_SHOW ||
            reserveStatus==ReserveStatus.CONFIRMED && newStatus==ReserveStatus.SCHEDULED)
            throw new IllegalParameterException("Não é possível alterar de ( " + reserveStatus + " ) para ( " + newStatus +" )" );



    }

    private boolean decideType(ReserveModel reserveModel, UserModel userModel){

        if (reserveModel.getUserModel().getId().equals(userModel.getId()))
            return true;
        else if (reserveModel.getTableModel().getRestaurantModel().getOwnerModel().getId().equals(userModel.getId())) {
            return false;
        }
        else {
            throw new ResourceNotFoundException();
        }
    }


    public ReserveUpdateResponseDTO updateStatusReserveById(UserModel userModel, Integer id, ReserveStatus newStatus){
        ReserveModel reserveModel = this.reserveRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);

        String menssage = null;
        if (    reserveModel.getDate().isBefore(LocalDate.now()) &&
                reserveModel.getStatus()!=ReserveStatus.CANCELED && reserveModel.getStatus()!=ReserveStatus.COMPLETED && reserveModel.getStatus()!=ReserveStatus.NO_SHOW

        ) {
            reserveModel.setStatus(ReserveStatus.NO_SHOW);
            menssage = "A data da reserva já expirou. A reserva foi automáticamente alterada para ( não comparecido )";
        }
        else{
            boolean userIsClient = decideType(reserveModel, userModel);
            this.validateNewStatusOfreserve(reserveModel, newStatus, userIsClient);
            menssage = "O status da reserva foi alterado com sucesso";
            reserveModel.setStatus(newStatus);
        }

        reserveModel = this.reserveRepository.save(reserveModel);

        return new ReserveUpdateResponseDTO(
                menssage,
                this.reserveMapper.modelToResponse(reserveModel)
        );

    }
}
