package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.dish.CreateDishRequestDTO;
import com.italosantos.minha_mesa.dto.dish.DishResponseDTO;
import com.italosantos.minha_mesa.dto.exception.ExceptionResponse;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.DishService;
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

@RestController
@RequestMapping("dishes")

@Tag(
        name = "10 - Pratos",
        description = "Operações relacionadas aos pratos de um restaurante"
)
public class DishController {
    private final DishService dishService;

    public DishController(DishService dishService) {
        this.dishService = dishService;
    }

    @SecurityRequirement(name="Bearer Authentication")
    @Operation(
            summary = "Cria um novo prato",
            description = "Crie um novo prato para o restaurante do dono."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "403", description = "Usuário não possui um restaurante cadastrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404", description = "O id da categoria enviada não foi encontrado.",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "409", description = "Já existe um prato com o nome enviado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400", description = "O preço ou tempo de preparo do prato está inválido.",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @PostMapping
    public ResponseEntity<DishResponseDTO> createDishresponseDTO(
            @AuthenticationPrincipal UserModel userModel,
            @RequestPart("data")CreateDishRequestDTO createDishRequestDTO,
            @RequestPart("image")MultipartFile image
            ){
        DishResponseDTO dishResponseDTO = this.dishService.createDish(userModel, createDishRequestDTO, image);
        return ResponseEntity.created(URI.create("/dishes/" + dishResponseDTO.id().toString())).body(dishResponseDTO);
    }

}
