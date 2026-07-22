package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.auth.LoginRequestDTO;
import com.italosantos.minha_mesa.dto.auth.RegisterRequestDTO;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager, TokenService tokenService, UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }


    public String login(LoginRequestDTO loginRequestDTO){
        Authentication credential = new UsernamePasswordAuthenticationToken(loginRequestDTO.email(), loginRequestDTO.password());
        Authentication auth = this.authenticationManager.authenticate(credential);
        String token = this.tokenService.generateToken( (UserModel) auth.getPrincipal());
        return token;
    }

    public UserModel register(RegisterRequestDTO registerRequestDTO){
        if (this.userRepository.existsByEmail(registerRequestDTO.email()))
            throw new RuntimeException("Ja existe um user com esse email");
        UserModel userModel = this.userMapper.registerToModel(registerRequestDTO, this.passwordEncoder);
        return this.userRepository.save(userModel);
    }
}
