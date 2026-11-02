package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.dish_category.CreateDishCategoryRequestDTO;
import com.italosantos.minha_mesa.dto.dish_category.DishCategoryResponseDTO;
import com.italosantos.minha_mesa.model.DishCategoryModel;
import com.italosantos.minha_mesa.model.DishModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DishCategoryMapper {
    public DishCategoryModel createToModel(CreateDishCategoryRequestDTO createDishCategoryRequestDTO, String imagePath, List<DishModel> dishModels, RestaurantModel restaurantModel, String slug ){
        DishCategoryModel dishCategoryModel = new DishCategoryModel();

        dishCategoryModel.setName(createDishCategoryRequestDTO.name());
        dishCategoryModel.setRestaurantModel(restaurantModel);
        dishCategoryModel.setActive(true);
        dishCategoryModel.setSlug(slug);
        dishCategoryModel.setImagePath(imagePath);

        if (dishModels!=null)
            dishCategoryModel.setDishModels(dishModels);

        return dishCategoryModel;
    }

    public DishCategoryResponseDTO modelToResponse(DishCategoryModel dishCategoryModel, String imageLink){
        return new DishCategoryResponseDTO(
                dishCategoryModel.getId(),
                dishCategoryModel.getRestaurantModel().getName(),
                dishCategoryModel.getName(),
                imageLink,
                dishCategoryModel.getActive(),
                dishCategoryModel.getSlug()
        );
    }
}
