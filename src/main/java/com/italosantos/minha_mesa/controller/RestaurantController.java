package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.CreateRestaurantRequestDTO;
import com.italosantos.minha_mesa.dto.restaurant.RestaurantResponseDTO;
import com.italosantos.minha_mesa.mapper.ReserveMapper;
import com.italosantos.minha_mesa.mapper.RestaurantMapper;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("restaurants")
public class RestaurantController {
    private final RestaurantMapper restaurantMapper;
    private final RestaurantService restaurantService;
    private final ReserveMapper reserveMapper;

    public RestaurantController(RestaurantMapper restaurantMapper, RestaurantService restaurantService, ReserveMapper reserveMapper) {
        this.restaurantMapper = restaurantMapper;
        this.restaurantService = restaurantService;
        this.reserveMapper = reserveMapper;
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponseDTO> getRestaurantBydId(@PathVariable Integer id){
        RestaurantModel restaurantModel = this.restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(this.restaurantMapper.modelToResponse(restaurantModel));
    }

    @PostMapping
    public ResponseEntity<RestaurantResponseDTO> createRestaurant(
            @AuthenticationPrincipal UserModel userModel,
            @RequestBody CreateRestaurantRequestDTO createRestaurantRequestDTO
            ){
        RestaurantModel restaurantModel = this.restaurantService.createRestaurant(userModel, createRestaurantRequestDTO);
        return ResponseEntity.created(URI.create("/restaurants" + restaurantModel.getId())).body(this.restaurantMapper.modelToResponse(restaurantModel));
    }

    @GetMapping("/reserves")
    public ResponseEntity<List<ReserveResponseDTO>> getReservesOfRestaurant(@AuthenticationPrincipal UserModel userModel){
        List<ReserveModel> reserveModels = this.restaurantService.getReservesOfRestaurant(userModel);
        List<ReserveResponseDTO> response = reserveModels.stream()
                .map(reserve -> this.reserveMapper.modelToResponse(reserve))
                .toList();

        return ResponseEntity.ok(response);
    }
}
