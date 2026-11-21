package com.italosantos.minha_mesa.infra;

import com.italosantos.minha_mesa.exception.NotPermitedException;
import com.italosantos.minha_mesa.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@Component
public class SecurityTokenXsrfFilter extends OncePerRequestFilter {
    private final TokenService tokenService;

    public SecurityTokenXsrfFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    private final List<HttpMethod> allowedMethods = List.of(HttpMethod.GET, HttpMethod.HEAD, HttpMethod.OPTIONS);
    private final List<String> allowedUrls = List.of("/auth/login", "/auth/register");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        System.out.println(path);
        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        System.out.println(method);

        if (!allowedUrls.contains(path) && !allowedMethods.contains(method)){
            String token = this.getToken(request);
            if (token==null)
                throw new NotPermitedException();
            boolean tokenIsValid = Objects.nonNull(this.tokenService.validateToken(token));

            if (!tokenIsValid)
                throw new NotPermitedException();
        }

        filterChain.doFilter(request, response);
    }


    private String  getToken(HttpServletRequest request){
        if(request.getCookies()==null)
            return null;

        List<Cookie> cookies = List.of(request.getCookies());

        return cookies.stream()
                .filter(cookie -> cookie.getName().equals(SecurityConfiguration.xsrfTokenCookieKeyName))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

    }
}
