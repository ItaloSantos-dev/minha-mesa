package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.working_schedule.CreateWorkingScheduleResquestDTO;
import com.italosantos.minha_mesa.dto.working_schedule.WorkingScheduleResponseDTO;
import com.italosantos.minha_mesa.mapper.WorkingScheduleMapper;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.WorkingScheduleModel;
import com.italosantos.minha_mesa.service.WorkingScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("working-schedules")
public class WorkingScheduleController {
    private final WorkingScheduleService workingScheduleService;
    private final WorkingScheduleMapper workingScheduleMapper;


    public WorkingScheduleController(WorkingScheduleService workingScheduleService, WorkingScheduleMapper workingScheduleMapper) {
        this.workingScheduleService = workingScheduleService;
        this.workingScheduleMapper = workingScheduleMapper;
    }

    @PostMapping
    public ResponseEntity<WorkingScheduleResponseDTO> createWorkingSchedule(
            @AuthenticationPrincipal UserModel userModel,
            @RequestBody CreateWorkingScheduleResquestDTO createWorkingScheduleResquestDTO
    ){
        WorkingScheduleModel workingScheduleModel = this.workingScheduleService.createWorkingSchedule(userModel, createWorkingScheduleResquestDTO);
        return ResponseEntity.created(URI.create("working-schedules" + workingScheduleModel.getId())).body(this.workingScheduleMapper.modelToResponse(workingScheduleModel));
    }
}
