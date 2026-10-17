package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.restaurant.CreateRestaurantRequestDTO;
import com.italosantos.minha_mesa.dto.restaurant.RestaurantResponseDTO;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.service.ImageService;
import org.springframework.stereotype.Component;

@Component
public class RestaurantMapper {
    private final WorkingScheduleMapper workingScheduleMapper;
    public RestaurantMapper(WorkingScheduleMapper workingScheduleMapper) {
        this.workingScheduleMapper = workingScheduleMapper;
    }

    public RestaurantModel createToModel(CreateRestaurantRequestDTO createRestaurantRequestDTO, OwnerModel ownerModel, String imagePerfilPath, String imageBannerPath){
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setOwnerModel(ownerModel);
        restaurantModel.setName(createRestaurantRequestDTO.name());
        restaurantModel.setPhone(createRestaurantRequestDTO.phone());
        restaurantModel.setAddress(createRestaurantRequestDTO.address());
        restaurantModel.setActive(true);
        restaurantModel.setImagePerfilPath(imagePerfilPath);
        restaurantModel.setImageBannerPath(imageBannerPath);
        return restaurantModel;
    }

    public RestaurantResponseDTO modelToResponse(RestaurantModel restaurantModel, String imagePerfilUrl, String imageBannerUrl){
        return new RestaurantResponseDTO(
                restaurantModel.getId(),
                restaurantModel.getName(),
                restaurantModel.getPhone(),
                restaurantModel.getAddress(),
                restaurantModel.getActive(),
                imagePerfilUrl,
                imageBannerUrl,
                restaurantModel.getWorkingScheduleModels().stream()
                        .map(this.workingScheduleMapper::modelToResponse)
                        .toList()
        );
    }
}
