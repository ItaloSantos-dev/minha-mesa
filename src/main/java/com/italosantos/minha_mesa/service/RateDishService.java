package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.rate_dish.CreateRateDishRequestDTO;
import com.italosantos.minha_mesa.dto.rate_dish.RateDishResponseDTO;
import com.italosantos.minha_mesa.exception.*;
import com.italosantos.minha_mesa.mapper.RateDishMapper;
import com.italosantos.minha_mesa.model.*;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import com.italosantos.minha_mesa.repository.DishRepository;
import com.italosantos.minha_mesa.repository.RateDishRepository;
import com.italosantos.minha_mesa.repository.ReserveDishRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RateDishService {
    private final RateDishRepository rateDishRepository;
    private final ReserveDishRepository reserveDishRepository;
    private final RateDishMapper rateDishMapper;
    private final DishRepository dishRepository;

    public RateDishService(RateDishRepository rateDishRepository, ReserveDishRepository reserveDishRepository, RateDishMapper rateDishMapper, DishRepository dishRepository) {
        this.rateDishRepository = rateDishRepository;
        this.reserveDishRepository = reserveDishRepository;
        this.rateDishMapper = rateDishMapper;
        this.dishRepository = dishRepository;
    }

    @Transactional
    public RateDishResponseDTO createRateDish(UserModel userModel, CreateRateDishRequestDTO createRateDishRequestDTO){
        if (this.rateDishRepository.existsByReserveDishModelId(createRateDishRequestDTO.reserveDishId()))
            throw new AlreadyExistsRateDishOfReserveDishException();

        ReserveDishModel reserveDishModel = this.reserveDishRepository.findByIdAndReserveModelUserModelId(createRateDishRequestDTO.reserveDishId(), userModel.getId())
                .orElseThrow(ResourceNotFoundException::new);

        if (createRateDishRequestDTO.rating()>5 || createRateDishRequestDTO.rating()<1)
            throw new IllegalParameterException("A nota enviada é inválida");

        if (!reserveDishModel.getDishModel().getActive()) 
            throw new NotPermitedException();
        
        ReserveModel reserveModel = reserveDishModel.getReserveModel();
        if (reserveModel.getStatus()!= ReserveStatus.COMPLETED && reserveModel.getStatus()!=ReserveStatus.IN_PROGRESS)
            throw new ReserveIsNotInProgressException("A reserva só pode receber comentários se estiver em progresso ou concluída.");

        
        RateDishModel rateDishModel = this.rateDishMapper.createToModel(createRateDishRequestDTO, reserveDishModel);

        rateDishModel = this.rateDishRepository.save(rateDishModel);
        reserveDishModel.setRateDishModel(rateDishModel);
        this.reserveDishRepository.save(reserveDishModel);

        DishModel dishModel = this.dishRepository.findById(rateDishModel.getReserveDishModel().getDishModel().getId())
                .orElseThrow(ResourceNotFoundException::new);

        dishModel.updateRating();

        this.dishRepository.save(dishModel);

        return this.rateDishMapper.modelToResponse(rateDishModel);

    }

    public RateDishResponseDTO getRateDishById(Integer id){
        RateDishModel rateDishModel = this.rateDishRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);
        if (!rateDishModel.getReserveDishModel().getDishModel().getActive())
            throw new NotPermitedException("O prato deste cometário está inativo.");
        return this.rateDishMapper.modelToResponse(rateDishModel);

    }
}
