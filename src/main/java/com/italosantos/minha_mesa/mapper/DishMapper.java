package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.dish.CreateDishRequestDTO;
import com.italosantos.minha_mesa.dto.dish.DishResponseDTO;
import com.italosantos.minha_mesa.dto.dish.DishesOfRestauranteResponseDTO;
import com.italosantos.minha_mesa.dto.dish.UpdateDishRequestDTO;
import com.italosantos.minha_mesa.dto.rate_dish.RateDishResponseDTO;
import com.italosantos.minha_mesa.model.DishCategoryModel;
import com.italosantos.minha_mesa.model.DishModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DishMapper {
    private final RateDishMapper rateDishMapper;

    public DishMapper(RateDishMapper rateDishMapper) {
        this.rateDishMapper = rateDishMapper;
    }

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
        List<RateDishResponseDTO> rates = dishModel.getReserveDishModels().stream()
                .filter(reserveDishModel -> reserveDishModel.getRateDishModel()!=null)
                .map(reserveDishModel -> this.rateDishMapper.modelToResponse(reserveDishModel.getRateDishModel()))
                .toList();

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
                dishModel.getActive(),
                rates
        );
    }

    public DishModel updateToModel(DishModel dishModel, UpdateDishRequestDTO updateDishRequestDTO, String newImagePath, String newSlug, DishCategoryModel newDishCategoryModel){
        if (updateDishRequestDTO.name() != null) {
            dishModel.setName(updateDishRequestDTO.name());
            dishModel.setSlug(newSlug);
        }

        if (updateDishRequestDTO.dishCategory() != null)
            dishModel.setDishCategoryModel(newDishCategoryModel);

        if (updateDishRequestDTO.description() != null)
            dishModel.setDescription(updateDishRequestDTO.description());

        if (updateDishRequestDTO.preparationTime() != null)
            dishModel.setPreparationTime(updateDishRequestDTO.preparationTime());

        if (updateDishRequestDTO.price() != null)
            dishModel.setPrice(updateDishRequestDTO.price());

        if (updateDishRequestDTO.active() != null)
            dishModel.setActive(updateDishRequestDTO.active());

        if (newImagePath != null)
            dishModel.setImagePath(newImagePath);

        return dishModel;

    }
}
