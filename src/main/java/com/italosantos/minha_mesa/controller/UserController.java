package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.exception.ExceptionResponse;
import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.mapper.ReserveMapper;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@Tag(
        name = "8 - Usuários",
        description = "Operações relacionadas aos usuários"
)
@RestController
@RequestMapping("users")
public class UserController {
    private final UserService userService;
    private final ReserveMapper reserveMapper;

    public UserController(UserService userService, ReserveMapper reserveMapper) {
        this.userService = userService;
        this.reserveMapper = reserveMapper;
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Busca reversas de um usuário com base no token JWT",
            description = "Retorna lista de todas reversas do usuário que fez a requisição"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reservas buscadas com sucesso")
    })
    @GetMapping("/reserves")
    public ResponseEntity<List<ReserveResponseDTO>> getReservesOfUser(@AuthenticationPrincipal UserModel userModel, Pageable pageable){
        List<ReserveModel> reserveResponseDTOS = this.userService.getReservesOfUser(userModel, pageable);
        List<ReserveResponseDTO> response = reserveResponseDTOS.stream()
                .map(this.reserveMapper::modelToResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Busca uma reserva de um usuário com base no id",
            description = "Retorna os dados da reserva"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reservas buscadas com sucesso"),
            @ApiResponse(
                    responseCode = "404", description = "Reserva não encontrada",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @GetMapping("/reserves/{id}")
    public ResponseEntity<ReserveResponseDTO> getReserveOfUserById(@AuthenticationPrincipal UserModel userModel, @PathVariable Integer id){
        ReserveModel reserveModel = this.userService.getReserveOfUserById(userModel, id);

        return ResponseEntity.ok(this.reserveMapper.modelToResponse(reserveModel));
    }
}
