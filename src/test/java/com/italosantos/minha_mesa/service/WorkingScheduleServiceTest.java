package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.working_schedule.CreateWorkingScheduleResquestDTO;
import com.italosantos.minha_mesa.exception.AlreadyExistsThisWorkingScheduleException;
import com.italosantos.minha_mesa.exception.NotPermitedException;
import com.italosantos.minha_mesa.exception.TimeIsInvalidException;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.WorkingScheduleModel;
import com.italosantos.minha_mesa.model.enums.DayOfWeek;
import com.italosantos.minha_mesa.repository.RestaurantRepository;
import com.italosantos.minha_mesa.repository.WorkingScheduleRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.User;

import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(MockitoExtension.class)
class WorkingScheduleServiceTest {
    @InjectMocks
    WorkingScheduleService workingScheduleService;

    @Mock
    WorkingScheduleRepository workingScheduleRepository;

    @Mock
    RestaurantRepository restaurantRepository;

    @Test
    @DisplayName("Dono tenta criar uma horário com hora de fim antes da hora de ínicio")
    void createWorkingScheduleCase1() {
        UserModel userModel = new UserModel();
        userModel.setId(1);

        CreateWorkingScheduleResquestDTO createWorkingScheduleResquestDTO = new CreateWorkingScheduleResquestDTO(
                DayOfWeek.FRIDAY,
                LocalTime.now(),
                LocalTime.now().minusHours(4)
        );

        Mockito.when(this.restaurantRepository.findByOwnerModelUserModelId(Mockito.any()))
                .thenReturn(Optional.of(new RestaurantModel()));

        assertThrows(TimeIsInvalidException.class, () -> this.workingScheduleService.createWorkingSchedule(userModel, createWorkingScheduleResquestDTO));

    }

    @Test
    @DisplayName("Dono tenta criar uma horário com valores já existentes")
    void createWorkingScheduleCase2() {
        UserModel userModel = new UserModel();
        userModel.setId(1);

        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setId(2);

        CreateWorkingScheduleResquestDTO createWorkingScheduleResquestDTO = new CreateWorkingScheduleResquestDTO(
                DayOfWeek.FRIDAY,
                LocalTime.now().minusHours(4),
                LocalTime.now()
        );

        Mockito.when(this.restaurantRepository.findByOwnerModelUserModelId(Mockito.any()))
                .thenReturn(Optional.of(restaurantModel));

        Mockito.when(this.workingScheduleRepository.existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(
                Mockito.any(),
                Mockito.any(),
                Mockito.any(),
                Mockito.any()
        ))
                        .thenReturn(true);

        assertThrows(AlreadyExistsThisWorkingScheduleException.class, () -> this.workingScheduleService.createWorkingSchedule(userModel, createWorkingScheduleResquestDTO));

    }

    @Test
    @DisplayName("Um dono/user tenta apagar um horário que não é seu")
    void deleteWorkingScheduleByIdCase1() {
        //Não dono
        UserModel userModel = new UserModel();
        userModel.setId(1);

        //Dono
        UserModel userModel1 = new UserModel();
        userModel1.setId(2);

        OwnerModel ownerModel = new OwnerModel();
        ownerModel.setUserModel(userModel1);
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setOwnerModel(ownerModel);
        WorkingScheduleModel workingScheduleModel = new WorkingScheduleModel();
        workingScheduleModel.setRestaurantModel(restaurantModel);

        Mockito.when(this.workingScheduleRepository.findById(Mockito.any()))
                .thenReturn(Optional.of(workingScheduleModel));

        assertThrows(NotPermitedException.class, () -> this.workingScheduleService.deleteWorkingScheduleById(userModel, 1));

    }
}