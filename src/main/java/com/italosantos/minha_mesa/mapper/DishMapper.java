package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.dish.CreateDishRequestDTO;
import com.italosantos.minha_mesa.dto.dish.DishResponseDTO;
import com.italosantos.minha_mesa.model.DishCategoryModel;
import com.italosantos.minha_mesa.model.DishModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;

@Component
public class DishMapper {
    public DishModel createToModel(CreateDishRequestDTO createDishRequestDTO, RestaurantModel restaurantModel,  @Nullable DishCategoryModel dishCategoryModel, String slug , String imagePath){
        DishModel dishModel = new DishModel();
        dishModel.setName(createDishRequestDTO.name());
        dishModel.setDishCategoryModel(dishCategoryModel);
        dishModel.setActive(true);
        dishModel.setPrice(createDishRequestDTO.price());
        dishModel.setDescription(createDishRequestDTO.description());
        dishModel.setSlug(slug);
        dishModel.setPreparationTime(createDishRequestDTO.preparationTime());
        dishModel.setImagePath(imagePath);
        dishModel.setRestaurantModel(restaurantModel);
        return dishModel;
    }

    public DishResponseDTO modelToResponse(DishModel dishModel, String imageLink) {
        return new DishResponseDTO(
                dishModel.getId(),
                dishModel.getName(),
                dishModel.getDishCategoryModel()!= null ? dishModel.getDishCategoryModel().getName() : null,
                dishModel.getDishCategoryModel()!= null ? dishModel.getDishCategoryModel().getId() : null,
                dishModel.getRestaurantModel().getName(),
                dishModel.getRestaurantModel().getId(),
                dishModel.getDescription(),
                dishModel.getPreparationTime(),
                dishModel.getRating(),
                dishModel.getPrice(),
                dishModel.getSlug(),
                imageLink,
                dishModel.getActive()
        );
    }
}
