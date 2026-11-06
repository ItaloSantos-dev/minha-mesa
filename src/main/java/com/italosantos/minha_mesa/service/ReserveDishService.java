package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.reserve_dish.CreateReserveDishRequestDTO;
import com.italosantos.minha_mesa.dto.reserve_dish.ReserveDishResponseDTO;
import com.italosantos.minha_mesa.exception.*;
import com.italosantos.minha_mesa.mapper.ReserveDishMapper;
import com.italosantos.minha_mesa.model.DishModel;
import com.italosantos.minha_mesa.model.ReserveDishModel;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import com.italosantos.minha_mesa.repository.DishRepository;
import com.italosantos.minha_mesa.repository.ReserveDishRepository;
import com.italosantos.minha_mesa.repository.ReserveRepository;
import org.springframework.stereotype.Service;

@Service
public class ReserveDishService {
    private final ReserveDishRepository reserveDIshRepository;
    private final ReserveRepository reserveRepository;
    private final DishRepository dishRepository;
    private final ReserveDishMapper reserveDishMapper;

    public ReserveDishService(
            ReserveDishRepository reserveDIshRepository,
            ReserveRepository reserveRepository,
            DishRepository dishRepository,
            ReserveDishMapper reserveDishMapper
    ) {
        this.reserveDIshRepository = reserveDIshRepository;
        this.reserveRepository = reserveRepository;
        this.dishRepository = dishRepository;
        this.reserveDishMapper = reserveDishMapper;
    }

    public ReserveDishResponseDTO createReserveDish(
            UserModel userModel,
            CreateReserveDishRequestDTO createReserveDishRequestDTO
    ) {
        if (this.reserveDIshRepository.existsByReserveModelIdAndDishModelId(createReserveDishRequestDTO.reserveId(), createReserveDishRequestDTO.dishId()))
            throw new AlreadyExistsReserveDishWithReserveAndDishException();

        ReserveModel reserveModel = this.reserveRepository.findById(createReserveDishRequestDTO.reserveId())
                .orElseThrow(() -> new ResourceNotFoundException("Não foi possível encontrar uma reserva com esse id."));

        DishModel dishModel = this.dishRepository.findById(createReserveDishRequestDTO.dishId())
                .orElseThrow(() -> new ResourceNotFoundException("Não foi possível econtrar nenhum prato com esse id."));


        if (!dishModel.getActive())
            throw new DishIsNotActive();

        if (!dishModel.getRestaurantModel().getOwnerModel().getUserModel().getId().equals(userModel.getId()))
            throw new DishIsNotYourRestaurantException();

        if (!reserveModel.getTableModel().getRestaurantModel().getOwnerModel().getUserModel().getId().equals(userModel.getId()))
            throw new ReserveIsNotYourRestaurantException();

        if (createReserveDishRequestDTO.quantity() == null || createReserveDishRequestDTO.quantity() <= 0)
            throw new IllegalParameterException("A quantidade do prato deve ser maior que zero");

        if (reserveModel.getStatus() != ReserveStatus.IN_PROGRESS)
            throw new ReserveIsNotInProgressException();

        ReserveDishModel reserveDishModel = this.reserveDishMapper.createToModel(
                createReserveDishRequestDTO,
                reserveModel,
                dishModel
        );
        reserveDishModel = this.reserveDIshRepository.save(reserveDishModel);

        return this.reserveDishMapper.modelToResponse(reserveDishModel);
    }
}
