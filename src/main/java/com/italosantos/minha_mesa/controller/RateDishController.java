
package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.exception.ExceptionResponse;
import com.italosantos.minha_mesa.dto.rate_dish.CreateRateDishRequestDTO;
import com.italosantos.minha_mesa.dto.rate_dish.RateDishResponseDTO;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.RateDishService;
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

import java.net.URI;

@Tag(
        name = "12 - Avaliações de pratos",
        description = "Operações relacionadas às avaliações dos pratos consumidos em reservas"
)
@RestController
@RequestMapping("rates-dish")
public class RateDishController {

    private final RateDishService rateDishService;

    public RateDishController(RateDishService rateDishService) {
        this.rateDishService = rateDishService;
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Avalia um prato consumido",
            description = "Registra uma avaliação para um prato associado a uma reserva do usuário autenticado."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Avaliação registrada com sucesso"),
            @ApiResponse(
                    responseCode = "400", description = "A nota ou os dados informados são inválidos",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404", description = "Registro de prato da reserva não encontrado",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            ),
            @ApiResponse(
                    responseCode = "409", description = "O prato já possui uma avaliação para esta reserva",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            )
    })
    @PostMapping
    public ResponseEntity<RateDishResponseDTO> createRateDish(
            @AuthenticationPrincipal UserModel userModel,
            @RequestBody CreateRateDishRequestDTO createRateDishRequestDTO
    ) {
        RateDishResponseDTO rateDishResponseDTO = this.rateDishService.createRateDish(
                userModel,
                createRateDishRequestDTO
        );

        return ResponseEntity.created(
                URI.create("/rates-dish/" + rateDishResponseDTO.id())
        ).body(rateDishResponseDTO);
    }
}
