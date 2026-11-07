package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.reserve_dish.CreateReserveDishRequestDTO;
import com.italosantos.minha_mesa.dto.reserve_dish.ReserveDishResponseDTO;
import com.italosantos.minha_mesa.model.DishModel;
import com.italosantos.minha_mesa.model.ReserveDishModel;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.enums.ReserveDishStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ReserveDishMapper {
    public ReserveDishModel createToModel(
            CreateReserveDishRequestDTO createReserveDishRequestDTO,
            ReserveModel reserveModel,
            DishModel dishModel
    ) {
        ReserveDishModel reserveDishModel = new ReserveDishModel();
        reserveDishModel.setReserveModel(reserveModel);
        reserveDishModel.setDishModel(dishModel);
        reserveDishModel.setDishPrice(dishModel.getPrice());
        reserveDishModel.setQuantity(createReserveDishRequestDTO.quantity());
        reserveDishModel.setCreatedAt(LocalDateTime.now());
        reserveDishModel.setStatus(ReserveDishStatus.PENDING);
        return reserveDishModel;
    }

    public ReserveDishResponseDTO modelToResponse(ReserveDishModel reserveDishModel) {
        return new ReserveDishResponseDTO(
                reserveDishModel.getId(),
                reserveDishModel.getReserveModel().getId(),
                reserveDishModel.getDishModel().getId(),
                reserveDishModel.getDishPrice(),
                reserveDishModel.getQuantity(),
                reserveDishModel.getCreatedAt(),
                reserveDishModel.getStatus()
        );
    }
}
