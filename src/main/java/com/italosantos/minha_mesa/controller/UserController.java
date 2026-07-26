package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.mapper.ReserveMapper;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("users")
public class UserController {
    private final UserService userService;
    private final ReserveMapper reserveMapper;

    public UserController(UserService userService, ReserveMapper reserveMapper) {
        this.userService = userService;
        this.reserveMapper = reserveMapper;
    }

    @GetMapping("/reserves")
    public ResponseEntity<List<ReserveResponseDTO>> getReservesOfUser(@AuthenticationPrincipal UserModel userModel){
        List<ReserveModel> reserveResponseDTOS = this.userService.getReservesOfUser(userModel);
        List<ReserveResponseDTO> response = reserveResponseDTOS.stream()
                .map(this.reserveMapper::modelToResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/reserves/{id}")
    public ResponseEntity<ReserveResponseDTO> getReserveOfUserById(@AuthenticationPrincipal UserModel userModel, @PathVariable Integer id){
        ReserveModel reserveModel = this.userService.getReserveOfUserById(userModel, id);

        return ResponseEntity.ok(this.reserveMapper.modelToResponse(reserveModel));
    }
}
