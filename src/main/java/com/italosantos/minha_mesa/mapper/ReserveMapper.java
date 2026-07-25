package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.reserve.CreateReserveRequestDTO;
import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.TableModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.enums.DayOfWeek;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ReserveMapper {
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
        return new ReserveResponseDTO(
                reserveModel.getId(),
                reserveModel.getUserModel().getName(),
                reserveModel.getTableModel().getRestaurantModel().getName(),
                reserveModel.getDate(),
                DayOfWeek.valueOf(reserveModel.getDate().getDayOfWeek().toString()),
                reserveModel.getTimeStart(),
                reserveModel.getTimeEnd(),
                reserveModel.getStatus(),
                reserveModel.getObservation(),
                reserveModel.getNumberOfPeople()
        );
    }
}
