package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.exception.ExceptionResponse;
import com.italosantos.minha_mesa.dto.reserve.CreateReserveRequestDTO;
import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.dto.reserve.ReserveUpdateResponseDTO;
import com.italosantos.minha_mesa.mapper.ReserveMapper;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import com.italosantos.minha_mesa.service.ReserveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
@Tag(
        name = "Reserva",
        description = "Operações relacionadas a reservas de mesas"
)
@RestController
@RequestMapping("reserves")
public class ReserveController {
    private final ReserveService reserveService;
    private final ReserveMapper reserveMapper;

    public ReserveController(ReserveService reserveService, ReserveMapper reserveMapper) {
        this.reserveService = reserveService;
        this.reserveMapper = reserveMapper;
    }

    @Operation(
            summary = "Cria uma reserva",
            description = "Cria uma nova reserva caso mesa, data e hora estejam disponíveis"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Reserva criada com sucesso"),
            @ApiResponse(
                    responseCode = "400", description = "Algum parametro inválido",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "409", description = "O restaurante não abre/abrirá na data escolhida",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404", description = "Mesa não encontrada",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @PostMapping
    public ResponseEntity<ReserveResponseDTO> createReserve(@AuthenticationPrincipal UserModel userModel, @RequestBody CreateReserveRequestDTO createReserveRequestDTO){
        ReserveModel reserveModel = this.reserveService.createReserve(createReserveRequestDTO, userModel);
        return ResponseEntity.created(URI.create("/working-schedules"+reserveModel.getId().toString())).body(this.reserveMapper.modelToResponse(reserveModel));
    }

    @Operation(
            summary = "Altera status de uma reserva",
            description = """
                Altera o status de uma reserva com base no ID informado.
        
                Regras:
                - Apenas o cliente responsável pela reserva ou o proprietário do restaurante podem alterar o status.
                - O cliente pode alterar o status apenas para CANCELADA.
                - O cancelamento só é permitido com pelo menos 2 dias de antecedência da data da reserva.
                - Não é permitido alterar reservas com status CANCELADA, CONCLUÍDA ou NÃO_COMPARECEU.
                - Não é permitido alterar o status para CONCLUÍDA ou NÃO_COMPARECEU antes da data da reserva.
                - Não é permitida a transição de AGENDADA para NÃO_COMPARECEU.
                - Não é permitida a transição de CONFIRMADA para AGENDADA.
                - Caso a data da reserva já tenha expirado e ela ainda não esteja CANCELADA, CONCLUÍDA ou NÃO_COMPARECEU, o sistema altera automaticamente o status para NÃO_COMPARECEU.
            """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200", description = "Status alterado com sucesso"
            ),
            @ApiResponse(
                    responseCode = "403", description = "Alguma restrição foi violada",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400", description = "Algum parametro inválido",
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
    @PatchMapping("/{id}/update-status")
    public ResponseEntity<ReserveUpdateResponseDTO> updateStatusOfReserveById(
            @AuthenticationPrincipal UserModel userModel,
            @PathVariable Integer id,
            @RequestBody ReserveStatus newStatus
    ){
        return ResponseEntity.ok(this.reserveService.updateStatusReserveById(userModel, id, newStatus));
    }
}
