package com.italosantos.minha_mesa.utility;

import com.italosantos.minha_mesa.dto.dish.DishResponseDTO;
import com.italosantos.minha_mesa.dto.rate_dish.RateDishResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.BestRatingsRestaurant;
import com.italosantos.minha_mesa.mapper.DishMapper;
import com.italosantos.minha_mesa.mapper.RateDishMapper;
import com.italosantos.minha_mesa.model.DishModel;
import com.italosantos.minha_mesa.model.RateDishModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.repository.DishRepository;
import com.italosantos.minha_mesa.repository.RateDishRepository;
import com.italosantos.minha_mesa.service.ImageService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RestaurantUtility {
    private final DishRepository dishRepository;
    private final RateDishRepository rateDishRepository;
    private final ImageService imageService;
    private final RateDishMapper rateDishMapper;
    private final DishMapper dishMapper;

    public RestaurantUtility(DishRepository dishRepository, RateDishRepository rateDishRepository, ImageService imageService, RateDishMapper rateDishMapper, DishMapper dishMapper) {
        this.dishRepository = dishRepository;
        this.rateDishRepository = rateDishRepository;
        this.imageService = imageService;
        this.rateDishMapper = rateDishMapper;
        this.dishMapper = dishMapper;
    }


    public BestRatingsRestaurant getBestsRatingOfRestaurant(RestaurantModel restaurantModel){
        List<DishModel> dishModels = this.dishRepository.findTop5ByRestaurantModelIdOrderByRatingDesc(restaurantModel.getId());
        List<RateDishModel> rateDishModels = this.rateDishRepository.findTop5ByReserveDishModelDishModelRestaurantModelIdOrderByRatingDesc(restaurantModel.getId());

        List<DishResponseDTO> bestDishes = dishModels.stream()
                .map(dish -> {
                    String imageLink = this.imageService.getAssignedUrl(dish.getImagePath());
                    return this.dishMapper.modelToResponse(dish, imageLink);
                })
                .toList();

        List<RateDishResponseDTO> bestRatesDishe = rateDishModels.stream()
                .map(this.rateDishMapper::modelToResponse)
                .toList();

        return new BestRatingsRestaurant(bestDishes, bestRatesDishe);
    }
}
