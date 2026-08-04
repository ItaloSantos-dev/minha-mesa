package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.exception.ExceptionResponse;
import com.italosantos.minha_mesa.dto.schedule_exception.CreateScheduleExceptionDTO;
import com.italosantos.minha_mesa.dto.schedule_exception.ScheduleExceptionResponseDTO;
import com.italosantos.minha_mesa.mapper.ScheduleExceptionMapper;
import com.italosantos.minha_mesa.model.ScheduleExceptionModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.ScheduleExceptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
@Tag(
        name = "Exceções de funcionamento",
        description = "Operações relacionadas a exceções de funcionamento"
)
@RestController
@RequestMapping("schedule-exceptions")
public class ScheduleExceptionController {
    private final ScheduleExceptionService scheduleExceptionService;
    private final ScheduleExceptionMapper scheduleExceptionMapper;

    public ScheduleExceptionController(ScheduleExceptionService scheduleExceptionService, ScheduleExceptionMapper scheduleExceptionMapper) {
        this.scheduleExceptionService = scheduleExceptionService;
        this.scheduleExceptionMapper = scheduleExceptionMapper;
    }

    @Operation(
            summary = "Cria uma exceção de funcionamento",
            description = "Retorna os dados da nova exceção criada"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Exceção criada com sucesso"),
            @ApiResponse(
                    responseCode = "403", description = "Usuário não possui um restaurante cadastrado",
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
                    responseCode = "409", description = "Já existe uma exception para essa data",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )

    })
    @PostMapping
    public ResponseEntity<ScheduleExceptionResponseDTO> createScheduleException(
            @AuthenticationPrincipal UserModel userModel,
            @RequestBody CreateScheduleExceptionDTO createScheduleExceptionDTO
            ){
        ScheduleExceptionModel scheduleExceptionModel = this.scheduleExceptionService.createscheduleExceptionModel(createScheduleExceptionDTO, userModel);
        return ResponseEntity.created(URI.create("/schedule-exceptions" + scheduleExceptionModel.getId())).body(this.scheduleExceptionMapper.modelToResponse(scheduleExceptionModel));
    }
}
