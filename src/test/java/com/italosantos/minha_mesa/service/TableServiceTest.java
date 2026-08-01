package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.table.CreateTableRequestDTO;
import com.italosantos.minha_mesa.exception.*;
import com.italosantos.minha_mesa.model.*;
import com.italosantos.minha_mesa.repository.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class TableServiceTest {

    @InjectMocks
    TableService tableService;

    @Mock
    TableRepository tableRepository;

    @Mock
    OwnerRepository ownerRepository;

    @Mock
    RestaurantRepository restaurantRepository;

    @Mock
    ScheduleExceptionRepository scheduleExceptionRepository;

    @Mock
    WorkingScheduleRepository workingScheduleRepository;

    @Test
    @DisplayName("Dono tenta criar uma mesa com capacidade menor que 1")
    void createTableCase1() {
        UserModel userModel = new UserModel();
        userModel.setId(1);

        OwnerModel ownerModel = new OwnerModel();
        ownerModel.setId(1);

        CreateTableRequestDTO createTableRequestDTO = new CreateTableRequestDTO(0, 0);

        Mockito.when(this.ownerRepository.findByUserModelId(Mockito.any()))
                .thenReturn(Optional.of(ownerModel));

        assertThrows(CapacityOfTableInvalidException.class, () -> this.tableService.createTable(createTableRequestDTO, userModel));

    }

    @Test
    @DisplayName("Dono tenta criar uma mesa com número já cadastrado")
    void createTableCase2() {
        UserModel userModel = new UserModel();
        userModel.setId(1);

        OwnerModel ownerModel = new OwnerModel();
        ownerModel.setId(1);

        CreateTableRequestDTO createTableRequestDTO = new CreateTableRequestDTO(1, 5);

        Mockito.when(this.ownerRepository.findByUserModelId(Mockito.any()))
                .thenReturn(Optional.of(ownerModel));

        Mockito.when(this.tableRepository.existsByNumberAndRestaurantModelOwnerModelId(Mockito.any(), Mockito.any()))
                .thenReturn(true);

        assertThrows(AlreadyExistTableWithNumberException.class, () -> this.tableService.createTable(createTableRequestDTO, userModel));

    }



    @Test
    @DisplayName("Um dono tenta deletar uma mesa que nao pertence ao seu restaurante")
    void deleteTableByIdCase1() {
        //não dono
        UserModel userModel = new UserModel();
        userModel.setId(1);

        OwnerModel ownerModel = new OwnerModel();
        ownerModel.setUserModel(userModel);
        ownerModel.setId(1);

        //dono
        UserModel userModel1 = new UserModel();
        userModel.setId(2);

        OwnerModel ownerModel1 = new OwnerModel();
        ownerModel1.setId(2);
        ownerModel1.setUserModel(userModel1);

        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setOwnerModel(ownerModel1);

        TableModel tableModel = new TableModel();
        tableModel.setRestaurantModel(restaurantModel);


        Mockito.when(this.ownerRepository.findByUserModelId(Mockito.any()))
                .thenReturn(Optional.of(ownerModel));

        Mockito.when(this.tableRepository.findById(Mockito.any()))
                .thenReturn(Optional.of(tableModel));

        assertThrows(NotPermitedException.class, ()-> this.tableService.deleteTableById(userModel, Mockito.any()));

    }

    @Test
    @DisplayName("User tenta buscar mesas em uma data que possui exception")
    void getTablesAvaliablesCase1() {
        Integer restaurantId = 1;
        Integer capacity = 2;
        LocalDate date = LocalDate.now().plusDays(10);
        LocalTime timeStart = LocalTime.now().plusHours(10);
        LocalTime timeEnd = LocalTime.now().plusHours(9);

        RestaurantModel restaurantModel = new RestaurantModel();

        Mockito.when(this.restaurantRepository.findById(Mockito.any()))
                .thenReturn(Optional.of(restaurantModel));

        Mockito.when(this.scheduleExceptionRepository.findByDateAndRestaurantModelId(Mockito.any(), Mockito.any()))
                .thenReturn(Optional.of(new ScheduleExceptionModel()));

        assertThrows(ThisDateOfReserveIsNotPermitedException.class, () -> this.tableService.getTablesAvaliables(
                restaurantId, capacity, date, timeStart, timeEnd
        ));
    }

    @Test
    @DisplayName("User tenta buscar mesas em uma data que o restaurante não abre")
    void getTablesAvaliablesCase2() {
        Integer restaurantId = 1;
        Integer capacity = 2;
        LocalDate date = LocalDate.now().plusDays(10);
        LocalTime timeStart = LocalTime.now().plusHours(10);
        LocalTime timeEnd = LocalTime.now().plusHours(9);

        RestaurantModel restaurantModel = new RestaurantModel();

        Mockito.when(this.restaurantRepository.findById(Mockito.any()))
                .thenReturn(Optional.of(restaurantModel));

        Mockito.when(this.scheduleExceptionRepository.findByDateAndRestaurantModelId(Mockito.any(), Mockito.any()))
                .thenReturn(Optional.empty());

        Mockito.when(this.workingScheduleRepository.existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(
                Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()
        ))
                .thenReturn(false);

        assertThrows(ThisDateOfReserveIsNotPermitedException.class, () -> this.tableService.getTablesAvaliables(
                restaurantId, capacity, date, timeStart, timeEnd
        ));
    }

    @Test
    @DisplayName("User tenta buscar mesas com capacidade menor que 1")
    void getTablesAvaliablesCase3() {
        Integer restaurantId = 1;
        Integer capacity = 0;
        LocalDate date = LocalDate.now().plusDays(10);
        LocalTime timeStart = LocalTime.now().plusHours(10);
        LocalTime timeEnd = LocalTime.now().plusHours(9);

        RestaurantModel restaurantModel = new RestaurantModel();

        Mockito.when(this.restaurantRepository.findById(Mockito.any()))
                .thenReturn(Optional.of(restaurantModel));

        Mockito.when(this.scheduleExceptionRepository.findByDateAndRestaurantModelId(Mockito.any(), Mockito.any()))
                .thenReturn(Optional.empty());

        Mockito.when(this.workingScheduleRepository.existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(
                        Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()
                ))
                .thenReturn(true);

        assertThrows(CapacityOfTableInvalidException.class, () -> this.tableService.getTablesAvaliables(
                restaurantId, capacity, date, timeStart, timeEnd
        ));
    }

    @Test
    @DisplayName("User tenta buscar mesas com data anterior a atual")
    void getTablesAvaliablesCase4() {
        Integer restaurantId = 1;
        Integer capacity = 1;
        LocalDate date = LocalDate.now().minusDays(10);
        LocalTime timeStart = LocalTime.now().plusHours(10);
        LocalTime timeEnd = LocalTime.now().plusHours(9);

        RestaurantModel restaurantModel = new RestaurantModel();

        Mockito.when(this.restaurantRepository.findById(Mockito.any()))
                .thenReturn(Optional.of(restaurantModel));

        Mockito.when(this.scheduleExceptionRepository.findByDateAndRestaurantModelId(Mockito.any(), Mockito.any()))
                .thenReturn(Optional.empty());

        Mockito.when(this.workingScheduleRepository.existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(
                        Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()
                ))
                .thenReturn(true);

        assertThrows(DateOfReserveIsInvalidException.class, () -> this.tableService.getTablesAvaliables(
                restaurantId, capacity, date, timeStart, timeEnd
        ));
    }

    @Test
    @DisplayName("User tenta buscar mesas com hora de início antes da hora de fim")
    void getTablesAvaliablesCase5() {
        Integer restaurantId = 1;
        Integer capacity = 1;
        LocalDate date = LocalDate.now().plusDays(10);
        LocalTime timeStart = LocalTime.now().plusHours(10);
        LocalTime timeEnd = LocalTime.now().plusHours(9);

        RestaurantModel restaurantModel = new RestaurantModel();

        Mockito.when(this.restaurantRepository.findById(Mockito.any()))
                .thenReturn(Optional.of(restaurantModel));

        Mockito.when(this.scheduleExceptionRepository.findByDateAndRestaurantModelId(Mockito.any(), Mockito.any()))
                .thenReturn(Optional.empty());

        Mockito.when(this.workingScheduleRepository.existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(
                        Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()
                ))
                .thenReturn(true);

        assertThrows(TimeOfReserveIsInvalidException.class, () -> this.tableService.getTablesAvaliables(
                restaurantId, capacity, date, timeStart, timeEnd
        ));
    }
}