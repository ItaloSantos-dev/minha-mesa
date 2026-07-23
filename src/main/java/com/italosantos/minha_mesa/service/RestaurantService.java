package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.restaurant.CreateRestaurantRequestDTO;
import com.italosantos.minha_mesa.mapper.RestaurantMapper;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RestaurantService {
    private final OwnerService ownerService;
    private final RestaurantMapper restaurantMapper;
    private final RestaurantRepository restaurantRepository;

    public RestaurantService(OwnerService ownerService, RestaurantMapper restaurantMapper, RestaurantRepository restaurantRepository) {
        this.ownerService = ownerService;
        this.restaurantMapper = restaurantMapper;
        this.restaurantRepository = restaurantRepository;
    }


    @Transactional
    public RestaurantModel createRestaurant(UserModel userModel, CreateRestaurantRequestDTO createRestaurantRequestDTO){
        if (this.restaurantRepository.existsByOwnerModelUserModelId(userModel.getId()))
            throw new RuntimeException("O user já tem um restaurant");

        OwnerModel ownerModel = this.ownerService.createOwner(userModel, createRestaurantRequestDTO.ownerData());
        RestaurantModel restaurantModel = this.restaurantMapper.createToModel(createRestaurantRequestDTO, ownerModel);
        return this.restaurantRepository.save(restaurantModel);
    }
}
