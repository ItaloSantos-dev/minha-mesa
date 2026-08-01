package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.table.CreateTableRequestDTO;
import com.italosantos.minha_mesa.exception.*;
import com.italosantos.minha_mesa.mapper.TableMapper;
import com.italosantos.minha_mesa.model.*;
import com.italosantos.minha_mesa.model.enums.DayOfWeek;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import com.italosantos.minha_mesa.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TableService {
    private final TableRepository tableRepository;
    private final OwnerRepository ownerRepository;
    private final TableMapper tableMapper;
    private final ScheduleExceptionRepository scheduleExceptionRepository;
    private final RestaurantRepository restaurantRepository;
    private final WorkingScheduleRepository workingScheduleRepository;

    public TableService(TableRepository tableRepository, OwnerRepository ownerRepository, TableMapper tableMapper, ScheduleExceptionRepository scheduleExceptionRepository, RestaurantRepository restaurantRepository, WorkingScheduleRepository workingScheduleRepository) {
        this.tableRepository = tableRepository;
        this.ownerRepository = ownerRepository;
        this.tableMapper = tableMapper;
        this.scheduleExceptionRepository = scheduleExceptionRepository;
        this.restaurantRepository = restaurantRepository;
        this.workingScheduleRepository = workingScheduleRepository;
    }

    public TableModel createTable(CreateTableRequestDTO createTableRequestDTO, UserModel userModel){
        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(NotPermitedException::new);
        if (this.tableRepository.existsByNumberAndRestaurantModelOwnerModelId(createTableRequestDTO.number(), ownerModel.getId()))
            throw new AlreadyExistTableWithNumberException();
        TableModel tableModel = this.tableMapper.createToModel(createTableRequestDTO, ownerModel.getRestaurantModel());

        return this.tableRepository.save(tableModel);
    }

    public void deleteTableById(UserModel userModel, Integer id){
        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(NotPermitedException::new);

        TableModel tableModel = this.tableRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);

        if (! tableModel.getRestaurantModel().getOwnerModel().getId().equals(ownerModel.getId()))
            throw new NotPermitedException();

        tableModel.setActive(false);
        this.tableRepository.save(tableModel);
    }

    public TableModel getTableById(Integer id){
        return this.tableRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);
    }

    private void validateParams(
            Integer restaurantId,
            Integer capacity,
            LocalDate date,
            LocalTime timeStart,
            LocalTime timeEnd
    ){
        Optional<ScheduleExceptionModel> scheduleExceptionModel = this.scheduleExceptionRepository.findByDateAndRestaurantModelId(date, restaurantId);

        if (scheduleExceptionModel.isPresent())
            throw new ThisDateOfReserveIsNotPermitedException(scheduleExceptionModel.get());

        if (!this.workingScheduleRepository.existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(
                restaurantId,
                DayOfWeek.valueOf(date.getDayOfWeek().toString()),
                timeStart,
                timeEnd
        ))
            throw new ThisDateOfReserveIsNotPermitedException();
        System.out.println("AQUI");

        if (capacity != null && capacity<1)
            throw new IllegalParameterException("A capacidade deve ser mair que 0");

        if (date.isBefore(LocalDate.now()))
            throw new IllegalParameterException("A data não pode ser anterior á atual");

        if (timeEnd.isBefore(timeStart))
            throw new IllegalParameterException("A hora do fim não pode ser antes da hora do início");

    }

    public List<TableModel> getTablesAvaliables(
            Integer restaurantId,
            Integer capacity,
            LocalDate date,
            LocalTime timeStart,
            LocalTime timeEnd
    ){
        RestaurantModel restaurantModel = this.restaurantRepository.findById(restaurantId)
                .orElseThrow(ResourceNotFoundException::new);

        this.validateParams(
                restaurantId,
                capacity,
                date,
                timeStart,
                timeEnd
        );

         return this.tableRepository.findAvailableTables(
                date,
                timeStart,
                ReserveStatus.CANCELED,
                capacity,
                restaurantId
        );





    }
}
