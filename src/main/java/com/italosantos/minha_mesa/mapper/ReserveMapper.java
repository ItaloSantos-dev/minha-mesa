package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.reserve.CreateReserveRequestDTO;
import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.dto.reserve_dish.ReserveDishResponseDTO;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.TableModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.enums.DayOfWeek;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ReserveMapper {
    private final ReserveDishMapper reserveDishMapper;

    public ReserveMapper(ReserveDishMapper reserveDishMapper){
        this.reserveDishMapper = reserveDishMapper;
    }
    public ReserveModel createToModel(CreateReserveRequestDTO createReserveRequestDTO, TableModel tableModel, UserModel userModel){
        ReserveModel reserveModel = new ReserveModel();
        reserveModel.setUserModel(userModel);
        reserveModel.setTableModel(tableModel);
        reserveModel.setDate(createReserveRequestDTO.date());
        reserveModel.setTimeStart(createReserveRequestDTO.timeStart());
        reserveModel.setTimeEnd(createReserveRequestDTO.timeEnd());
        reserveModel.setObservation(createReserveRequestDTO.observation()==null ? null : createReserveRequestDTO.observation());
        reserveModel.setCreatedAt(LocalDateTime.now());
        reserveModel.setNumberOfPeople(createReserveRequestDTO.peoples());
        reserveModel.setNumberOfPeople(createReserveRequestDTO.peoples());
        reserveModel.setStatus(ReserveStatus.SCHEDULED);

        return reserveModel;
    }

    public ReserveResponseDTO modelToResponse(ReserveModel reserveModel){
        List<ReserveDishResponseDTO> reserveDishes = reserveModel.getReserveDishModels().stream()
        .map(reserveDishModel -> this.reserveDishMapper.modelToResponse(reserveDishModel))
        .toList();

        return new ReserveResponseDTO(
                reserveModel.getId(),
                reserveModel.getUserModel().getName(),
                reserveModel.getTableModel().getNumber(),
                reserveModel.getTableModel().getRestaurantModel().getName(),
                reserveModel.getDate(),
                DayOfWeek.valueOf(reserveModel.getDate().getDayOfWeek().toString()),
                reserveModel.getTimeStart(),
                reserveModel.getTimeEnd(),
                reserveModel.getStatus(),
                reserveModel.getObservation(),
                reserveModel.getNumberOfPeople(),
                reserveDishes
        );
    }
}
