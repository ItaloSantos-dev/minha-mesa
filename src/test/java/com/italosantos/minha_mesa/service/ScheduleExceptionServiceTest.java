package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.schedule_exception.CreateScheduleExceptionDTO;
import com.italosantos.minha_mesa.exception.AlreadyExistsScheduleExceptionException;
import com.italosantos.minha_mesa.exception.IllegalParameterException;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.repository.OwnerRepository;
import com.italosantos.minha_mesa.repository.ScheduleExceptionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(MockitoExtension.class)
class ScheduleExceptionServiceTest {

    @InjectMocks
    ScheduleExceptionService scheduleExceptionService;

    @Mock
    OwnerRepository ownerRepository;

    @Mock
    ScheduleExceptionRepository scheduleExceptionRepository;


    @Test
    @DisplayName("Dono tenta criar uma exception com uma data antes da atual")
    void createscheduleExceptionModelCase1() {
        UserModel userModel = new UserModel();
        userModel.setId(5);



        CreateScheduleExceptionDTO createScheduleExceptionDTO = new CreateScheduleExceptionDTO(LocalDate.now().minusDays(2), "Motivo");

        Mockito.when(this.ownerRepository.findByUserModelId(Mockito.any()))
                .thenReturn(Optional.of(new OwnerModel()));

        assertThrows(IllegalParameterException.class, ()->
                this.scheduleExceptionService.createscheduleExceptionModel(createScheduleExceptionDTO, userModel)
        );

    }

    @Test
    @DisplayName("Dono tenta criar uma exception cujo data ja possui uma exception")
    void createscheduleExceptionModelCase2() {
        UserModel userModel = new UserModel();
        userModel.setId(5);

        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setId(1);
        OwnerModel ownerModel = new OwnerModel();
        ownerModel.setRestaurantModel(restaurantModel);


        CreateScheduleExceptionDTO createScheduleExceptionDTO = new CreateScheduleExceptionDTO(LocalDate.now(), "Motivo");

        Mockito.when(this.ownerRepository.findByUserModelId(Mockito.any()))
                .thenReturn(Optional.of(ownerModel));

        Mockito.when(this.scheduleExceptionRepository.existsByDateAndRestaurantModelId(Mockito.any(), Mockito.any()))
                        .thenReturn(true);

        assertThrows(AlreadyExistsScheduleExceptionException.class, ()->
                this.scheduleExceptionService.createscheduleExceptionModel(createScheduleExceptionDTO, userModel)
        );

    }

    @Test
    @DisplayName("Dono tenta criar uma exception sem motivo")
    void createscheduleExceptionModelCase3() {
        UserModel userModel = new UserModel();
        userModel.setId(5);

        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setId(1);
        OwnerModel ownerModel = new OwnerModel();
        ownerModel.setRestaurantModel(restaurantModel);


        CreateScheduleExceptionDTO createScheduleExceptionDTO = new CreateScheduleExceptionDTO(LocalDate.now(), null);

        Mockito.when(this.ownerRepository.findByUserModelId(Mockito.any()))
                .thenReturn(Optional.of(ownerModel));

        Mockito.when(this.scheduleExceptionRepository.existsByDateAndRestaurantModelId(Mockito.any(), Mockito.any()))
                .thenReturn(false);

        assertThrows(IllegalParameterException.class, ()->
                this.scheduleExceptionService.createscheduleExceptionModel(createScheduleExceptionDTO, userModel)
        );

    }
}