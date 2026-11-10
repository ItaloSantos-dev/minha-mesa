package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.dish.CreateDishRequestDTO;
import com.italosantos.minha_mesa.dto.dish.DishResponseDTO;
import com.italosantos.minha_mesa.dto.dish.UpdateDishRequestDTO;
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
import jakarta.annotation.Nullable;
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
    public ResponseEntity<DishResponseDTO> createDish(
            @AuthenticationPrincipal UserModel userModel,
            @RequestPart("data")CreateDishRequestDTO createDishRequestDTO,
            @RequestPart("image")MultipartFile image
            ){
        DishResponseDTO dishResponseDTO = this.dishService.createDish(userModel, createDishRequestDTO, image);
        return ResponseEntity.created(URI.create("/dishes/" + dishResponseDTO.id().toString())).body(dishResponseDTO);
    }

    @Operation(
            summary = "Busca um prato pelo id",
            description = "Restorna os dados do prato buscado pelo id."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "404", description = "O id do prato enviado não foi encontrado.",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<DishResponseDTO> getDishById(
            @PathVariable Integer id
    ){
        return ResponseEntity.ok(this.dishService.getDishById(id));
    }


    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Atualiza os dados de um prato",
            description = "Atualiza os dados de um prato pertencente ao restaurante do dono"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Prato atualizado com sucesso"),
            @ApiResponse(
                    responseCode = "400", description = "Parâmetros inválidos para atualizar o prato",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "403", description = "Usuário não possui um restaurante cadastrado ou o prato/categoria não pertence a ele",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404", description = "Prato ou categoria não encontrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "409", description = "O restaurante já possui um prato com o nome enviado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "500", description = "Falha ao enviar a imagem do prato",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @PatchMapping("/{id}")
    public ResponseEntity<DishResponseDTO> updateDishById(
            @AuthenticationPrincipal UserModel userModel,
            @PathVariable Integer id,
            @RequestPart(value = "data", required = false) @Nullable UpdateDishRequestDTO updateDishRequestDTO,
            @RequestPart(value = "image", required = false) @Nullable MultipartFile newImage
    ) {
        return ResponseEntity.ok(
                this.dishService.updateDishById(
                        userModel,
                        id,
                        updateDishRequestDTO,
                        newImage
                )
        );
    }
}
