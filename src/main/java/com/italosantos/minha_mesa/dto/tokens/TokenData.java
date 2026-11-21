package com.italosantos.minha_mesa.dto.tokens;

public record TokenData(
        String accessToken,
        String xsrfToken
) {
}
