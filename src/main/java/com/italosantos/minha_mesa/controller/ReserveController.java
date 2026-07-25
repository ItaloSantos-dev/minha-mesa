package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.reserve.CreateReserveRequestDTO;
import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.mapper.ReserveMapper;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.ReserveService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("reserves")
public class ReserveController {
    private final ReserveService reserveService;
    private final ReserveMapper reserveMapper;

    public ReserveController(ReserveService reserveService, ReserveMapper reserveMapper) {
        this.reserveService = reserveService;
        this.reserveMapper = reserveMapper;
    }

    @PostMapping
    public ResponseEntity<ReserveResponseDTO> createReserve(@AuthenticationPrincipal UserModel userModel, @RequestBody CreateReserveRequestDTO createReserveRequestDTO){
        ReserveModel reserveModel = this.reserveService.createReserve(createReserveRequestDTO, userModel);
        return ResponseEntity.created(URI.create("/working-schedules"+reserveModel.getId().toString())).body(this.reserveMapper.modelToResponse(reserveModel));
    }
}
