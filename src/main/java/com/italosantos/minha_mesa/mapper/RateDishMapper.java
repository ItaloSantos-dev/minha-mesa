package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.rate_dish.CreateRateDishRequestDTO;
import com.italosantos.minha_mesa.dto.rate_dish.RateDishResponseDTO;
import com.italosantos.minha_mesa.model.RateDishModel;
import com.italosantos.minha_mesa.model.ReserveDishModel;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class RateDishMapper {
    public RateDishModel createToModel(CreateRateDishRequestDTO createRateDishRequestDTO, ReserveDishModel reserveDishModel){
        RateDishModel rateDishModel = new RateDishModel();

        rateDishModel.setReserveDishModel(reserveDishModel);
        rateDishModel.setRating(createRateDishRequestDTO.rating());
        rateDishModel.setComment(createRateDishRequestDTO.comment());
        rateDishModel.setCreatedAt(LocalDateTime.now());
        return  rateDishModel;
    }

    public RateDishResponseDTO modelToResponse(RateDishModel rateDishModel){
        return new RateDishResponseDTO(
                rateDishModel.getId(),
                rateDishModel.getReserveDishModel().getDishModel().getId(),
                rateDishModel.getReserveDishModel().getDishModel().getName(),
                rateDishModel.getReserveDishModel().getReserveModel().getId(),
                rateDishModel.getReserveDishModel().getReserveModel().getTableModel().getRestaurantModel().getName(),
                rateDishModel.getRating(),
                rateDishModel.getComment()
        );
    }
}
