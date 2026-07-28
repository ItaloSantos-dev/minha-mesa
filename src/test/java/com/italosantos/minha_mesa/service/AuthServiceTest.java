package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.auth.RegisterRequestDTO;
import com.italosantos.minha_mesa.exception.UserAlreadyIsOwnerException;
import com.italosantos.minha_mesa.exception.UserAlreadyRegisterException;
import com.italosantos.minha_mesa.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    AuthService authService;

    @Mock
    UserRepository userRepository;

    @Test
    @DisplayName("User já cadastrado tenta se cadastrar")
    void register() {
        RegisterRequestDTO registerRequestDTO = new RegisterRequestDTO("Italo", "99984587631", "italo@gmail.com", "1131casalol");

        Mockito.when(this.userRepository.existsByEmail(Mockito.any())).thenReturn(true);

        assertThrows(UserAlreadyRegisterException.class, () ->{
            this.authService.register(registerRequestDTO);
        });

    }
}