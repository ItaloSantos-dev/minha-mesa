package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.exception.ExceptionResponse;
import com.italosantos.minha_mesa.dto.working_schedule.CreateWorkingScheduleResquestDTO;
import com.italosantos.minha_mesa.dto.working_schedule.WorkingScheduleResponseDTO;
import com.italosantos.minha_mesa.mapper.WorkingScheduleMapper;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.WorkingScheduleModel;
import com.italosantos.minha_mesa.service.WorkingScheduleService;
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
        name = "4 - Horários de funcionamento",
        description = "Operações relacionadas aos horáriso de funcionamento de um restaurante"
)
@RestController
@RequestMapping("working-schedules")
public class WorkingScheduleController {
    private final WorkingScheduleService workingScheduleService;


    public WorkingScheduleController(WorkingScheduleService workingScheduleService) {
        this.workingScheduleService = workingScheduleService;
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Cria um horário de funcionamento",
            description = "Retorna os dados do novo horário cadastrado"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Horário criado com sucesso"),
            @ApiResponse(
                    responseCode = "404", description = "Restaurante não encontrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400", description = "Horário inválido",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "409", description = "Já existe um horário com esses valores",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @PostMapping
    public ResponseEntity<WorkingScheduleResponseDTO> createWorkingSchedule(
            @AuthenticationPrincipal UserModel userModel,
            @RequestBody CreateWorkingScheduleResquestDTO createWorkingScheduleResquestDTO
    ){
        WorkingScheduleResponseDTO workingScheduleResponseDTO = this.workingScheduleService.createWorkingSchedule(userModel, createWorkingScheduleResquestDTO);
        return ResponseEntity.created(URI.create("working-schedules" + workingScheduleResponseDTO.id())).body(workingScheduleResponseDTO);
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Delete um horário de funcionamento",
            description = "Deleta um horário de funcionamento pelo id"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Horário deletado com sucesso"),
            @ApiResponse(
                    responseCode = "404", description = "Horário não encontrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "403", description = "O horário não pertence a quem fez a requisição",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkingScheduleById(@AuthenticationPrincipal UserModel userModel, @PathVariable Integer id){
        this.workingScheduleService.deleteWorkingScheduleById(userModel, id);
        return ResponseEntity.noContent().build();

    }
}
