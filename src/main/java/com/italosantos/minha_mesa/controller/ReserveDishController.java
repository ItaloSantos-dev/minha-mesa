package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.exception.ExceptionResponse;
import com.italosantos.minha_mesa.dto.reserve_dish.CreateReserveDishRequestDTO;
import com.italosantos.minha_mesa.dto.reserve_dish.ReserveDishResponseDTO;
import com.italosantos.minha_mesa.dto.reserve_dish.UpdateReserveDishRequestDTO;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.ReserveDishService;
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
        name = "11 - Pratos da reserva",
        description = "Operações relacionadas aos pratos associados a uma reserva"
)
@RestController
@RequestMapping("reserve-dishes")
public class ReserveDishController {
    private final ReserveDishService reserveDishService;

    public ReserveDishController(ReserveDishService reserveDishService) {
        this.reserveDishService = reserveDishService;
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Adiciona um prato a uma reserva",
            description = "Registra um prato em uma reserva em andamento pertencente ao restaurante do usuário autenticado."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Prato adicionado à reserva com sucesso"),
            @ApiResponse(
                    responseCode = "400", description = "A quantidade informada deve ser maior que zero",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            ),
            @ApiResponse(
                    responseCode = "403", description = "O usuário não é proprietário do restaurante",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            ),
            @ApiResponse(
                    responseCode = "409", description = "A reserva não está em andamento",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404", description = "Reserva ou prato não encontrado",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            )
    })
    @PostMapping
    public ResponseEntity<ReserveDishResponseDTO> createReserveDish(
            @AuthenticationPrincipal UserModel userModel,
            @RequestBody CreateReserveDishRequestDTO createReserveDishRequestDTO
    ) {
        ReserveDishResponseDTO reserveDishResponseDTO = this.reserveDishService.createReserveDish(
                userModel,
                createReserveDishRequestDTO
        );
        return ResponseEntity.created(URI.create("/reserve-dishes/" + reserveDishResponseDTO.id()))
                .body(reserveDishResponseDTO);
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Atualiza os dados de um prato da reserva",
            description = "Atualiza as quantidades de pratos adicionados, cancelados ou completados em um registro de prato associado a uma reserva."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Prato da reserva atualizado com sucesso"),
            @ApiResponse(
                    responseCode = "400", description = "Os valores informados são inválidos ou ultrapassam a quantidade total de pratos",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            ),
            @ApiResponse(
                    responseCode = "403", description = "O usuário não é proprietário do restaurante",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404", description = "Registro de prato da reserva não encontrado",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            ),
            @ApiResponse(
                    responseCode = "409", description = "A reserva não permite mais alterações nos pratos",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            )
    })
    @PatchMapping("/{id}")
    public ResponseEntity<ReserveDishResponseDTO> updateReserveDish(
            @AuthenticationPrincipal UserModel userModel,
            @PathVariable Integer id,
            @RequestBody UpdateReserveDishRequestDTO updateReserveDishRequestDTO
    ) {
        ReserveDishResponseDTO reserveDishResponseDTO = this.reserveDishService.updateStatusById(
                userModel,
                id,
                updateReserveDishRequestDTO
        );

        return ResponseEntity.ok(reserveDishResponseDTO);
    }

}
