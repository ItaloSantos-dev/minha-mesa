package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.reserve_dish.CreateReserveDishRequestDTO;
import com.italosantos.minha_mesa.dto.reserve_dish.ReserveDishResponseDTO;
import com.italosantos.minha_mesa.dto.reserve_dish.UpdateReserveDishRequestDTO;
import com.italosantos.minha_mesa.model.DishModel;
import com.italosantos.minha_mesa.model.ReserveDishModel;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.enums.ReserveDishStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
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
                reserveDishModel.getCompletedQuantity(),
                reserveDishModel.getCanceledQuantity(),
                reserveDishModel.getQuantity() - reserveDishModel.getCanceledQuantity() - reserveDishModel.getCompletedQuantity(),
                reserveDishModel.getDishPrice().multiply(BigDecimal.valueOf(reserveDishModel.getCompletedQuantity())),
                reserveDishModel.getCreatedAt(),
                reserveDishModel.getStatus()
        );
    }

    public ReserveDishModel updateToModel(
            ReserveDishModel reserveDishModel,
            ReserveDishStatus newStatus,
            UpdateReserveDishRequestDTO updateReserveDishRequestDTO
    ) {
        if (newStatus != null)
            reserveDishModel.setStatus(newStatus);

        if (updateReserveDishRequestDTO.addQuantity() != null)
            reserveDishModel.setQuantity(reserveDishModel.getQuantity() + updateReserveDishRequestDTO.addQuantity());

        if (updateReserveDishRequestDTO.addCanceledQuantity() != null)
            reserveDishModel.setCanceledQuantity(reserveDishModel.getCanceledQuantity() + updateReserveDishRequestDTO.addCanceledQuantity());

        if (updateReserveDishRequestDTO.addCompletedQuantity() != null)
            reserveDishModel.setCompletedQuantity(reserveDishModel.getCompletedQuantity() + updateReserveDishRequestDTO.addCompletedQuantity());

        return reserveDishModel;
    }
}
