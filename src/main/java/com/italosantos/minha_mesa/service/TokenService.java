package com.italosantos.minha_mesa.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.italosantos.minha_mesa.model.UserModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    private final UserService userService;

    @Value("${spring.jwt.secret}")
    private String  secretJWT;

    public TokenService(UserService userService) {
        this.userService = userService;
    }

    public Instant generatedExpiratedAt(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }

    public String generateToken(UserModel userModel){
        Algorithm algorithm = Algorithm.HMAC256(this.secretJWT);
        return JWT.create()
                .withSubject(userModel.getId().toString())
                .withIssuer("minha-mesa")
                .withExpiresAt(this.generatedExpiratedAt())
                .sign(algorithm);
    }

    public String validateToken(String token){
        Algorithm algorithm = Algorithm.HMAC256(this.secretJWT);
        return JWT.require(algorithm)
                .withIssuer("minha-mesa")
                .build()
                .verify(token)
                .getSubject();
    }
}
