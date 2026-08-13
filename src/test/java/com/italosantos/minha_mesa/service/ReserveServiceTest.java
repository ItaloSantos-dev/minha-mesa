package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.reserve.CreateReserveRequestDTO;
import com.italosantos.minha_mesa.dto.reserve.ReserveUpdateResponseDTO;
import com.italosantos.minha_mesa.exception.IllegalParameterException;
import com.italosantos.minha_mesa.exception.NotPermitedException;
import com.italosantos.minha_mesa.exception.TableOfReserveIsOcupedException;
import com.italosantos.minha_mesa.exception.ThisDateOfReserveIsNotPermitedException;
import com.italosantos.minha_mesa.mapper.ReserveMapper;
import com.italosantos.minha_mesa.model.*;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import com.italosantos.minha_mesa.repository.ReserveRepository;
import com.italosantos.minha_mesa.repository.ScheduleExceptionRepository;
import com.italosantos.minha_mesa.repository.TableRepository;
import com.italosantos.minha_mesa.repository.WorkingScheduleRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(MockitoExtension.class)
class ReserveServiceTest {
    @InjectMocks
    ReserveService reserveService;

    @Mock
    ScheduleExceptionRepository scheduleExceptionRepository;

    @Mock
    TableRepository tableRepository;

    @Mock
    ReserveRepository reserveRepository;

    @Mock
    WorkingScheduleRepository workingScheduleRepository;

    @Mock
    ReserveMapper reserveMapper;

    @Mock
    CacheService cacheService;



    @Test
    @DisplayName("Usuário tenta criar reserva em mesa ja reservada")
    void createReserveCase1() {
        CreateReserveRequestDTO createReserveRequestDTO = new CreateReserveRequestDTO(1, LocalDate.now(), LocalTime.now(), LocalTime.now(), 5, "");

        TableModel tableModel = new TableModel();

        Mockito.when(this.tableRepository.findById(Mockito.any())).thenReturn(Optional.of(tableModel));

        Mockito.when(this.reserveRepository.existsByTableModelIdAndDateAndTimeStartAndTimeEndAndStatus(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(true);

        assertThrows(TableOfReserveIsOcupedException.class, ()->{
            this.reserveService.createReserve(createReserveRequestDTO, Mockito.any());
        });
    }

    @Test
    @DisplayName("Usuário tenta criar reserva em data que tem exception")
    void createReserveCase2(){
        CreateReserveRequestDTO createReserveRequestDTO = new CreateReserveRequestDTO(1, LocalDate.now(), LocalTime.now(), LocalTime.now(), 5, "");

        Optional<ScheduleExceptionModel> scheduleExceptionModel = Optional.of(new ScheduleExceptionModel());

        TableModel tableModel = new TableModel();
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setId(1);
        tableModel.setRestaurantModel(restaurantModel);

        Mockito.when(this.tableRepository.findById(Mockito.any())).thenReturn(Optional.of(tableModel));

        Mockito.when(this.reserveRepository.existsByTableModelIdAndDateAndTimeStartAndTimeEndAndStatus(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(false);

        Mockito.when(this.scheduleExceptionRepository.findByDateAndRestaurantModelId(Mockito.any(), Mockito.any()))
                .thenReturn(scheduleExceptionModel);

        assertThrows(ThisDateOfReserveIsNotPermitedException.class, ()->{
            this.reserveService.createReserve(createReserveRequestDTO, Mockito.any());
        });
    }

    @Test
    @DisplayName("Usuario tenta criar reserva em mesa não ativa")
    void createReserveCase3(){
        CreateReserveRequestDTO createReserveRequestDTO = new CreateReserveRequestDTO(1, LocalDate.now(), LocalTime.now(), LocalTime.now(), 5, "");


        TableModel tableModel = new TableModel();
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setId(1);
        tableModel.setActive(false);
        tableModel.setRestaurantModel(restaurantModel);

        Mockito.when(this.tableRepository.findById(Mockito.any())).thenReturn(Optional.of(tableModel));

        Mockito.when(this.reserveRepository.existsByTableModelIdAndDateAndTimeStartAndTimeEndAndStatus(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(false);

        Mockito.when(this.scheduleExceptionRepository.findByDateAndRestaurantModelId(Mockito.any(), Mockito.any()))
                .thenReturn(Optional.empty());


        assertThrows(IllegalParameterException.class, ()->{
            this.reserveService.createReserve(createReserveRequestDTO, Mockito.any());
        });
    }

    @Test
    @DisplayName("Usuário tenta criar reserva em dia que o restaurante não abre")
    void createReserveCase4(){
        CreateReserveRequestDTO createReserveRequestDTO = new CreateReserveRequestDTO(1, LocalDate.now(), LocalTime.now(), LocalTime.now(), 5, "");

        TableModel tableModel = new TableModel();
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setId(1);
        tableModel.setActive(true);
        tableModel.setRestaurantModel(restaurantModel);

        Mockito.when(this.tableRepository.findById(Mockito.any())).thenReturn(Optional.of(tableModel));

        Mockito.when(this.reserveRepository.existsByTableModelIdAndDateAndTimeStartAndTimeEndAndStatus(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(false);

        Mockito.when(this.scheduleExceptionRepository.findByDateAndRestaurantModelId(Mockito.any(), Mockito.any()))
                .thenReturn(Optional.empty());

        Mockito.when(this.workingScheduleRepository.existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(false);

        assertThrows(ThisDateOfReserveIsNotPermitedException.class, ()->{
            this.reserveService.createReserve(createReserveRequestDTO, Mockito.any());
        });
    }

    @Test
    @DisplayName("Usuário tenta criar reserva em uma mesa com capacidade menor do que o numero de pessoas")
    void createReserveCase5(){
        CreateReserveRequestDTO createReserveRequestDTO = new CreateReserveRequestDTO(1, LocalDate.now(), LocalTime.now(), LocalTime.now(), 5, "");

        TableModel tableModel = new TableModel();
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setId(1);
        tableModel.setActive(true);
        tableModel.setCapacity(4);
        tableModel.setRestaurantModel(restaurantModel);

        Mockito.when(this.tableRepository.findById(Mockito.any())).thenReturn(Optional.of(tableModel));

        Mockito.when(this.reserveRepository.existsByTableModelIdAndDateAndTimeStartAndTimeEndAndStatus(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(false);

        Mockito.when(this.scheduleExceptionRepository.findByDateAndRestaurantModelId(Mockito.any(), Mockito.any()))
                .thenReturn(Optional.empty());

        Mockito.when(this.workingScheduleRepository.existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(true);

        assertThrows(IllegalParameterException.class, ()->{
            this.reserveService.createReserve(createReserveRequestDTO, Mockito.any());
        });
    }

    @Test
    @DisplayName("Usuário tenta criar reserva em uma data anterior a atual")
    void createReserveCase6(){
        CreateReserveRequestDTO createReserveRequestDTO = new CreateReserveRequestDTO(1, LocalDate.now().minusDays(5), LocalTime.now(), LocalTime.now(), 5, "");

        TableModel tableModel = new TableModel();
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setId(1);
        tableModel.setActive(true);
        tableModel.setCapacity(5);
        tableModel.setRestaurantModel(restaurantModel);

        Mockito.when(this.tableRepository.findById(Mockito.any())).thenReturn(Optional.of(tableModel));

        Mockito.when(this.reserveRepository.existsByTableModelIdAndDateAndTimeStartAndTimeEndAndStatus(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(false);

        Mockito.when(this.scheduleExceptionRepository.findByDateAndRestaurantModelId(Mockito.any(), Mockito.any()))
                .thenReturn(Optional.empty());

        Mockito.when(this.workingScheduleRepository.existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(true);

        assertThrows(IllegalParameterException.class, ()->{
            this.reserveService.createReserve(createReserveRequestDTO, Mockito.any());
        });
    }

    @Test
    @DisplayName("Usuário tenta criar reserva com uma hora de fim anterior a hora de inicio")
    void createReserveCase7(){
        CreateReserveRequestDTO createReserveRequestDTO = new CreateReserveRequestDTO(1, LocalDate.now(), LocalTime.now(), LocalTime.now().minusHours(5), 5, "");

        TableModel tableModel = new TableModel();
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setId(1);
        tableModel.setActive(true);
        tableModel.setCapacity(5);
        tableModel.setRestaurantModel(restaurantModel);

        Mockito.when(this.tableRepository.findById(Mockito.any())).thenReturn(Optional.of(tableModel));

        Mockito.when(this.reserveRepository.existsByTableModelIdAndDateAndTimeStartAndTimeEndAndStatus(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(false);

        Mockito.when(this.scheduleExceptionRepository.findByDateAndRestaurantModelId(Mockito.any(), Mockito.any()))
                .thenReturn(Optional.empty());

        Mockito.when(this.workingScheduleRepository.existsByRestaurantModelIdAndDayOfWeekAndTimeStartAndTimeEnd(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(true);

        assertThrows(IllegalParameterException.class, ()->{
            this.reserveService.createReserve(createReserveRequestDTO, Mockito.any());
        });
    }



    @Test
    @DisplayName("Dono tenta mudar o status de uma reserva que ja passou da data. muda automaticamente para NO-SHOW")
    void updateStatusReserveByIdCase1() {
        ReserveModel reserveModel = new ReserveModel();
        reserveModel.setDate(LocalDate.now().minusDays(5));
        reserveModel.setStatus(ReserveStatus.SCHEDULED);


        Mockito.when(this.reserveRepository.findById(Mockito.any()))
                .thenReturn(Optional.of(reserveModel));

        this.reserveService.updateStatusReserveById(new UserModel(), 1, ReserveStatus.CANCELED);

        //Crio um capturador que monitora funções que recebe ReserveModel
        ArgumentCaptor<ReserveModel> captor = ArgumentCaptor.forClass(ReserveModel.class);

        //Verifico se na função testada tem um reserveRespository.save e guardo o valor passado (mesma classe infromada ao meu captor )
        Mockito.verify(this.reserveRepository).save(captor.capture());

        //guardo o valor que foi enviado ao .save
        ReserveModel savedReserve = captor.getValue();

        assertEquals(ReserveStatus.NO_SHOW, savedReserve.getStatus());
    }

    @Test
    @DisplayName("Cliente tenta mudar o status de uma reserva que para um valor que não seja CANCELED")
    void updateStatusReserveByIdCase2() {
        UserModel userModel = new UserModel();
        userModel.setId(1);

        ReserveModel reserveModel = new ReserveModel();
        reserveModel.setDate(LocalDate.now().plusDays(5));
        reserveModel.setStatus(ReserveStatus.SCHEDULED);
        reserveModel.setUserModel(userModel);


        Mockito.when(this.reserveRepository.findById(Mockito.any()))
                .thenReturn(Optional.of(reserveModel));

        assertThrows(NotPermitedException.class, () ->{
            this.reserveService.updateStatusReserveById(userModel, 1, ReserveStatus.NO_SHOW);
        });


    }

    @Test
    @DisplayName("Cliente ou dono tenta cancelar a reserva com menos de 2 dias de antecedência")
    void updateStatusReserveByIdCase3() {
        UserModel userModel = new UserModel();
        userModel.setId(2);

        UserModel ownerUserModel = new UserModel();
        ownerUserModel.setId(1);

        OwnerModel ownerModel = new OwnerModel();
        ownerModel.setUserModel(ownerUserModel);

        TableModel tableModel = new TableModel();
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setOwnerModel(ownerModel);
        tableModel.setRestaurantModel(restaurantModel);

        ReserveModel reserveModel = new ReserveModel();
        reserveModel.setDate(LocalDate.now().plusDays(1));
        reserveModel.setStatus(ReserveStatus.SCHEDULED);
        reserveModel.setUserModel(userModel);
        reserveModel.setTableModel(tableModel);


        Mockito.when(this.reserveRepository.findById(Mockito.any()))
                .thenReturn(Optional.of(reserveModel));

        assertThrows(NotPermitedException.class, () ->{
            this.reserveService.updateStatusReserveById(ownerUserModel, 1, ReserveStatus.CANCELED);
        });
    }

    @Test
    @DisplayName("Dono tentar alterar o status para COMPLETED ou NO-SHOW antes da data da reserva")
    void updateStatusReserveByIdCase4() {
        UserModel userModel = new UserModel();
        userModel.setId(2);

        UserModel ownerUserModel = new UserModel();
        ownerUserModel.setId(1);

        OwnerModel ownerModel = new OwnerModel();
        ownerModel.setUserModel(ownerUserModel);

        TableModel tableModel = new TableModel();
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setOwnerModel(ownerModel);
        tableModel.setRestaurantModel(restaurantModel);

        ReserveModel reserveModel = new ReserveModel();
        reserveModel.setDate(LocalDate.now().plusDays(5));
        reserveModel.setStatus(ReserveStatus.SCHEDULED);
        reserveModel.setUserModel(userModel);
        reserveModel.setTableModel(tableModel);


        Mockito.when(this.reserveRepository.findById(Mockito.any()))
                .thenReturn(Optional.of(reserveModel));

        assertThrows(IllegalParameterException.class, () ->{
            this.reserveService.updateStatusReserveById(ownerUserModel, 1, ReserveStatus.COMPLETED);
        });
    }

    @Test
    @DisplayName("Dono tentar alterar uma reserva que ja esta ou NO_SHOW, CONFIRMED ou CANCELED")
    void updateStatusReserveByIdCase5() {
        UserModel userModel = new UserModel();
        userModel.setId(2);

        UserModel ownerUserModel = new UserModel();
        ownerUserModel.setId(1);

        OwnerModel ownerModel = new OwnerModel();
        ownerModel.setUserModel(ownerUserModel);

        TableModel tableModel = new TableModel();
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setOwnerModel(ownerModel);
        tableModel.setRestaurantModel(restaurantModel);

        ReserveModel reserveModel = new ReserveModel();
        reserveModel.setDate(LocalDate.now().plusDays(5));
        reserveModel.setStatus(ReserveStatus.NO_SHOW);
        reserveModel.setUserModel(userModel);
        reserveModel.setTableModel(tableModel);


        Mockito.when(this.reserveRepository.findById(Mockito.any()))
                .thenReturn(Optional.of(reserveModel));

        assertThrows(IllegalParameterException.class, () ->{
            this.reserveService.updateStatusReserveById(ownerUserModel, 1, ReserveStatus.SCHEDULED);
        });
    }

    @Test
    @DisplayName("Dono tentar alterar ou SHCEDULED -> NO_SHOW ou CONFIRMED -> SCHEDULED")
    void updateStatusReserveByIdCase6() {
        UserModel userModel = new UserModel();
        userModel.setId(2);

        UserModel ownerUserModel = new UserModel();
        ownerUserModel.setId(1);

        OwnerModel ownerModel = new OwnerModel();
        ownerModel.setUserModel(ownerUserModel);

        TableModel tableModel = new TableModel();
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setOwnerModel(ownerModel);
        tableModel.setRestaurantModel(restaurantModel);

        ReserveModel reserveModel = new ReserveModel();
        reserveModel.setDate(LocalDate.now().plusDays(5));
        reserveModel.setStatus(ReserveStatus.SCHEDULED);
        reserveModel.setUserModel(userModel);
        reserveModel.setTableModel(tableModel);


        Mockito.when(this.reserveRepository.findById(Mockito.any()))
                .thenReturn(Optional.of(reserveModel));

        assertThrows(IllegalParameterException.class, () ->{
            this.reserveService.updateStatusReserveById(ownerUserModel, 1, ReserveStatus.NO_SHOW);
        });

        reserveModel.setStatus(ReserveStatus.CONFIRMED);
        assertThrows(IllegalParameterException.class, () ->{
            this.reserveService.updateStatusReserveById(ownerUserModel, 1, ReserveStatus.SCHEDULED);
        });
    }
}