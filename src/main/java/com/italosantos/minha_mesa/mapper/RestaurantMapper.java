package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.dish.DishResponseDTO;
import com.italosantos.minha_mesa.dto.rate_dish.RateDishResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.BestRatingsRestaurant;
import com.italosantos.minha_mesa.dto.restaurant.CreateRestaurantRequestDTO;
import com.italosantos.minha_mesa.dto.restaurant.RestaurantResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.UpdateRestaurantRequestDTO;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.service.ImageService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RestaurantMapper {
    private final WorkingScheduleMapper workingScheduleMapper;
    public RestaurantMapper(WorkingScheduleMapper workingScheduleMapper) {
        this.workingScheduleMapper = workingScheduleMapper;
    }

    public RestaurantModel createToModel(CreateRestaurantRequestDTO createRestaurantRequestDTO, OwnerModel ownerModel, String imagePerfilPath, String imageBannerPath, String slug){
        RestaurantModel restaurantModel = new RestaurantModel();
        restaurantModel.setOwnerModel(ownerModel);
        restaurantModel.setSlug(slug);
        restaurantModel.setName(createRestaurantRequestDTO.name());
        restaurantModel.setPhone(createRestaurantRequestDTO.phone());
        restaurantModel.setAddress(createRestaurantRequestDTO.address());
        restaurantModel.setActive(true);
        restaurantModel.setImagePerfilPath(imagePerfilPath);
        restaurantModel.setImageBannerPath(imageBannerPath);
        return restaurantModel;
    }

    public RestaurantResponseDTO modelToResponse(RestaurantModel restaurantModel, String imagePerfilUrl, String imageBannerUrl, BestRatingsRestaurant bestRatings){
        return new RestaurantResponseDTO(
                restaurantModel.getId(),
                restaurantModel.getName(),
                restaurantModel.getSlug(),
                restaurantModel.getPhone(),
                restaurantModel.getAddress(),
                restaurantModel.getActive(),
                imagePerfilUrl,
                imageBannerUrl,
                restaurantModel.getWorkingScheduleModels().stream()
                        .map(this.workingScheduleMapper::modelToResponse)
                        .toList(),
                bestRatings
        );
    }

    public RestaurantModel updateToModel(RestaurantModel restaurantModel, UpdateRestaurantRequestDTO updateRestaurantRequestDTO, String slug, String imagePerfilPath, String imageBannerPath){
        if (updateRestaurantRequestDTO.name()!=null){
            restaurantModel.setName(updateRestaurantRequestDTO.name());
            restaurantModel.setSlug(slug);
        }

        if (Boolean.TRUE.equals(updateRestaurantRequestDTO.updateActive()))
            restaurantModel.setActive(!restaurantModel.getActive());

        if (updateRestaurantRequestDTO.phone()!=null)
            restaurantModel.setPhone(updateRestaurantRequestDTO.phone());

        if (updateRestaurantRequestDTO.address()!=null)
            restaurantModel.setAddress(updateRestaurantRequestDTO.address());

        if (imagePerfilPath!=null)
            restaurantModel.setImagePerfilPath(imagePerfilPath);

        if (imageBannerPath!=null)
            restaurantModel.setImageBannerPath(imageBannerPath);

        return restaurantModel;
    }
}
