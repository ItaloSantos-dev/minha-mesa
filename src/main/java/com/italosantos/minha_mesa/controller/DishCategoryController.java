package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.dish_category.CreateDishCategoryRequestDTO;
import com.italosantos.minha_mesa.dto.dish_category.DishCategoryResponseDTO;
import com.italosantos.minha_mesa.dto.exception.ExceptionResponse;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.DishCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;

@Tag(
        name = "09 - Categoria de pratos",
        description = "Operações relacionadas a categorias de pratos do restaurante"
)
@RestController
@RequestMapping("dish-category")
public class DishCategoryController {
    private final DishCategoryService dishCategoryService;

    public DishCategoryController(DishCategoryService dishCategoryService) {
        this.dishCategoryService = dishCategoryService;
    }


    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Cria uma categoria de pratos",
            description = "Cria uma nova categoria de pratos para o restaurante do dono"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Reserva criada com sucesso"),
            @ApiResponse(
                    responseCode = "403", description = "Usuário não possui um restaurante cadastrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "409", description = "O restaurante já possui uma categoria com o nome enviado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404", description = "Um dos pratos a serem adicionados na categoria não foi encontrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @PostMapping
    public ResponseEntity<DishCategoryResponseDTO> createDishCategory(
            @AuthenticationPrincipal UserModel userModel,
            @RequestPart("data")CreateDishCategoryRequestDTO createDishCategoryRequestDTO,
            @RequestPart("image")MultipartFile image
            ){
        DishCategoryResponseDTO dishCategoryResponseDTO = this.dishCategoryService.createDishCategory(userModel, createDishCategoryRequestDTO, image);
        return ResponseEntity.created(URI.create("/dish-category/" + dishCategoryResponseDTO.id())).body(dishCategoryResponseDTO);
    }
}
