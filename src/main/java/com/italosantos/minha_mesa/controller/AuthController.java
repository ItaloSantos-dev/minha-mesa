package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.auth.LoginRequestDTO;
import com.italosantos.minha_mesa.dto.auth.RegisterRequestDTO;
import com.italosantos.minha_mesa.dto.user.UserResponseDTO;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.AuthService;
import com.italosantos.minha_mesa.mapper.UserMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;

    public AuthController(AuthService authService, UserMapper userMapper) {
        this.authService = authService;
        this.userMapper = userMapper;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDTO loginRequestDTO){
        String token = this.authService.login(loginRequestDTO);
        return ResponseEntity.ok(token);
    }


    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody RegisterRequestDTO registerRequestDTO){
        UserModel userModel = this.authService.register(registerRequestDTO);
        return ResponseEntity.ok(this.userMapper.modelToResponse(userModel));
    }
}
