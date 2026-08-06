package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.exception.ExceptionResponse;
import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.CreateRestaurantRequestDTO;
import com.italosantos.minha_mesa.dto.restaurant.RestaurantResponseDTO;
import com.italosantos.minha_mesa.dto.working_schedule.WorkingScheduleResponseDTO;
import com.italosantos.minha_mesa.mapper.ReserveMapper;
import com.italosantos.minha_mesa.mapper.RestaurantMapper;
import com.italosantos.minha_mesa.mapper.WorkingScheduleMapper;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.WorkingScheduleModel;
import com.italosantos.minha_mesa.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.FailedApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
@Tag(
        name = "02 - Restaurantes",
        description = "Operaçãoes relacionadas aos restaurantes"
)
@RestController
@RequestMapping("restaurants")
public class RestaurantController {
    private final RestaurantMapper restaurantMapper;
    private final RestaurantService restaurantService;
    private final ReserveMapper reserveMapper;
    private final WorkingScheduleMapper workingScheduleMapper;



    public RestaurantController(RestaurantMapper restaurantMapper, RestaurantService restaurantService, ReserveMapper reserveMapper, WorkingScheduleMapper workingScheduleMapper) {
        this.restaurantMapper = restaurantMapper;
        this.restaurantService = restaurantService;
        this.reserveMapper = reserveMapper;
        this.workingScheduleMapper = workingScheduleMapper;
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Cria um novo restaurante",
            description = "Retorna dados do novo restaurante cadastrado"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Restaurante criado com sucesso"),
            @ApiResponse(
                    responseCode = "404", description = "Restaurante não encontrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "409", description = "Usuário já possui um restaurante cadastrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
    })
    @PostMapping
    public ResponseEntity<RestaurantResponseDTO> createRestaurant(
            @AuthenticationPrincipal UserModel userModel,
            @RequestBody CreateRestaurantRequestDTO createRestaurantRequestDTO
    ){
        RestaurantModel restaurantModel = this.restaurantService.createRestaurant(userModel, createRestaurantRequestDTO);
        return ResponseEntity.created(URI.create("/restaurants" + restaurantModel.getId())).body(this.restaurantMapper.modelToResponse(restaurantModel));
    }

    @Operation(
            summary = "Busca restaurante pelo id",
            description = "Retorna dados de um restaurante, caso não encontre retorna erro"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Restaurante encontrado com sucesso"),
            @ApiResponse(
                    responseCode = "404", description = "Restaurante não encontrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponseDTO> getRestaurantBydId(@PathVariable Integer id){
        RestaurantModel restaurantModel = this.restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(this.restaurantMapper.modelToResponse(restaurantModel));
    }



    @SecurityRequirement(name = "Bearer Authentication")

    @Operation(
            summary = "Busca as reservas do restaurante pelo id do usuário que fez a requisição",
            description = "Retorna todas reservas do restaurante do usuário que fez a requisição"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reservas encontradas com sucesso"),
            @ApiResponse(
                    responseCode = "403", description = "Usuário não possui um restaurante cadastrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @GetMapping("/reserves")
    public ResponseEntity<List<ReserveResponseDTO>> getReservesOfRestaurant(@AuthenticationPrincipal UserModel userModel, Pageable pageable){
        List<ReserveModel> reserveModels = this.restaurantService.getReservesOfRestaurant(userModel, pageable);
        List<ReserveResponseDTO> response = reserveModels.stream()
                .map(reserve -> this.reserveMapper.modelToResponse(reserve))
                .toList();

        return ResponseEntity.ok(response);
    }


    @SecurityRequirement(name = "Bearer Authentication")

    @Operation(
            summary = "Busca uma reserva de um restaurante pelo id do usuário que fez a requisição e pelo id da reserva",
            description = "Retorna os dados da reserva buscada"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reserva encontrada com sucesso"),
            @ApiResponse(
                    responseCode = "403", description = "Usuário não possui um restaurante cadastrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404", description = "Reserva não encontrada",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @GetMapping("/reserves/{id}")
    public ResponseEntity<ReserveResponseDTO> getReserveOfRestaurantById(@AuthenticationPrincipal UserModel userModel, @PathVariable Integer id){
        ReserveModel reserveModel = this.restaurantService.getReserveOfRestaurantById(userModel, id);
        return ResponseEntity.ok(this.reserveMapper.modelToResponse(reserveModel));
    }

    @Operation(
            summary = "Busca os dias de funcionamento de restaurante pelo id",
            description = "Retorna os dias de funcionamento de um restaurante"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Dias de funcionamento encontrados com sucesso"),
            @ApiResponse(
                    responseCode = "404", description = "Restaurante não encontrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @GetMapping("/{id}/working-scheduleds")
    public ResponseEntity<List<WorkingScheduleResponseDTO>> getDaysWorkingOfRestaurantById(@PathVariable Integer id, Pageable pageable){

        List<WorkingScheduleModel> workingScheduleModels = this.restaurantService.getDaysWorkingOfRestaurantById(id, pageable);

        List<WorkingScheduleResponseDTO> response = workingScheduleModels.stream()
                .map(working -> this.workingScheduleMapper.modelToResponse(working))
                .toList();

        return ResponseEntity.ok(response);
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Desativa o restaurante do usuário que fez a requisição",
            description = "Retorna void se tiver sucesso"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Restaurante desativado com suceso"),
            @ApiResponse(responseCode = "409", description = "O restaurante do usuário já está desativado")
    })
    @DeleteMapping
    public ResponseEntity<Void> deleteRestaurantByUser(
            @AuthenticationPrincipal UserModel userModel
    ){
        this.restaurantService.deleteRestaurantByUser(userModel);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
