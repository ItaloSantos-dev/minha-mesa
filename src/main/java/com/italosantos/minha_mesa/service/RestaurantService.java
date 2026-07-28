package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.exception.ResourceNotFoundException;
import com.italosantos.minha_mesa.exception.RestaurantNotFoundException;
import com.italosantos.minha_mesa.exception.UserAlreadyIsOwnerException;
import com.italosantos.minha_mesa.dto.restaurant.CreateRestaurantRequestDTO;
import com.italosantos.minha_mesa.exception.UserIsNotOwnerException;
import com.italosantos.minha_mesa.mapper.RestaurantMapper;
import com.italosantos.minha_mesa.model.*;
import com.italosantos.minha_mesa.repository.OwnerRepository;
import com.italosantos.minha_mesa.repository.ReserveRepository;
import com.italosantos.minha_mesa.repository.RestaurantRepository;
import com.italosantos.minha_mesa.repository.WorkingScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RestaurantService {
    private final OwnerService ownerService;
    private final RestaurantMapper restaurantMapper;
    private final RestaurantRepository restaurantRepository;
    private final OwnerRepository ownerRepository;
    private final ReserveRepository reserveRepository;
    private final WorkingScheduleRepository workingScheduleRepository;

    public RestaurantService(OwnerService ownerService, RestaurantMapper restaurantMapper, RestaurantRepository restaurantRepository, OwnerRepository ownerRepository, ReserveRepository reserveRepository, WorkingScheduleRepository workingScheduleRepository) {
        this.ownerService = ownerService;
        this.restaurantMapper = restaurantMapper;
        this.restaurantRepository = restaurantRepository;
        this.ownerRepository = ownerRepository;
        this.reserveRepository = reserveRepository;
        this.workingScheduleRepository = workingScheduleRepository;
    }


    @Transactional
    public RestaurantModel createRestaurant(UserModel userModel, CreateRestaurantRequestDTO createRestaurantRequestDTO){
        if (this.restaurantRepository.existsByOwnerModelUserModelId(userModel.getId()))
            throw new UserAlreadyIsOwnerException();

        OwnerModel ownerModel = this.ownerService.createOwner(userModel, createRestaurantRequestDTO.ownerData());
        RestaurantModel restaurantModel = this.restaurantMapper.createToModel(createRestaurantRequestDTO, ownerModel);
        return this.restaurantRepository.save(restaurantModel);
    }

    public RestaurantModel getRestaurantById(Integer id){
        return this.restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotFoundException(id));
    }

    public List<ReserveModel> getReservesOfRestaurant(UserModel userModel){
        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(UserIsNotOwnerException::new);
        return this.reserveRepository.findByTableModelRestaurantModelId(ownerModel.getRestaurantModel().getId());
    }

    public ReserveModel getReserveOfRestaurantById(UserModel userModel, Integer id){
        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(UserIsNotOwnerException::new);

        return this.reserveRepository.findByIdAndTableModelRestaurantModelId(id, ownerModel.getRestaurantModel().getId())
                .orElseThrow(ResourceNotFoundException::new);
    }

    public List<WorkingScheduleModel> getDaysWorkingOfRestaurantById(Integer id){
        return this.workingScheduleRepository.findByRestaurantModelId(id);
    }
}
