package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.auth.LoginRequestDTO;
import com.italosantos.minha_mesa.dto.auth.RegisterRequestDTO;
import com.italosantos.minha_mesa.dto.exception.ExceptionResponse;
import com.italosantos.minha_mesa.dto.user.UserResponseDTO;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.AuthService;
import com.italosantos.minha_mesa.mapper.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@Tag(
        name = "01 - Autenticação",
        description = "Operações relacionadas a autenticação de usuário"
)
@RestController
@RequestMapping("auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @Operation(
            summary = "Login de usuário",
            description = "Retorna token temporario para usuário logado"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario logado com sucesso"),
            @ApiResponse(
                    responseCode = "401", description = "Falha no login",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDTO loginRequestDTO){
        String token = this.authService.login(loginRequestDTO);
        return ResponseEntity.ok(token);
    }


    @Operation(
            summary = "Registra novo usuário",
            description = "Retorna dados do novo usuário cadastrado"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario resgistrado com sucesso."),
            @ApiResponse(
                    responseCode = "409", description = "O e-mail informado já está cadastrado.",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            )
    })
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody RegisterRequestDTO registerRequestDTO){
        return ResponseEntity.ok(this.authService.register(registerRequestDTO));
    }
}
