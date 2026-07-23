package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.restaurant.CreateRestaurantRequestDTO;
import com.italosantos.minha_mesa.dto.restaurant.RestaurantResponseDTO;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import org.springframework.stereotype.Component;

@Component
public class RestaurantMapper {
    public RestaurantModel createToModel(CreateRestaurantRequestDTO createRestaurantRequestDTO, OwnerModel ownerModel){
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setOwnerModel(ownerModel);
        restaurantModel.setName(createRestaurantRequestDTO.name());
        restaurantModel.setPhone(createRestaurantRequestDTO.phone());
        restaurantModel.setAddress(createRestaurantRequestDTO.address());
        return restaurantModel;
    }

    public RestaurantResponseDTO modelToResponse(RestaurantModel restaurantModel){
        return new RestaurantResponseDTO(restaurantModel.getId(), restaurantModel.getName(), restaurantModel.getPhone(), restaurantModel.getAddress());
    }
}
