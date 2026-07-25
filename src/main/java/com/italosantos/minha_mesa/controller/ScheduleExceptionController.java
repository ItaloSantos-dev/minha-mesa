package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.schedule_exception.CreateScheduleExceptionDTO;
import com.italosantos.minha_mesa.dto.schedule_exception.ScheduleExceptionResponseDTO;
import com.italosantos.minha_mesa.mapper.ScheduleExceptionMapper;
import com.italosantos.minha_mesa.model.ScheduleExceptionModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.ScheduleExceptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("schedule-exceptions")
public class ScheduleExceptionController {
    private final ScheduleExceptionService scheduleExceptionService;
    private final ScheduleExceptionMapper scheduleExceptionMapper;

    public ScheduleExceptionController(ScheduleExceptionService scheduleExceptionService, ScheduleExceptionMapper scheduleExceptionMapper) {
        this.scheduleExceptionService = scheduleExceptionService;
        this.scheduleExceptionMapper = scheduleExceptionMapper;
    }

    @PostMapping
    public ResponseEntity<ScheduleExceptionResponseDTO> createScheduleException(
            @AuthenticationPrincipal UserModel userModel,
            @RequestBody CreateScheduleExceptionDTO createScheduleExceptionDTO
            ){
        ScheduleExceptionModel scheduleExceptionModel = this.scheduleExceptionService.createscheduleExceptionModel(createScheduleExceptionDTO, userModel);
        return ResponseEntity.created(URI.create("/schedule-exceptions" + scheduleExceptionModel.getId())).body(this.scheduleExceptionMapper.modelToResponse(scheduleExceptionModel));
    }
}
