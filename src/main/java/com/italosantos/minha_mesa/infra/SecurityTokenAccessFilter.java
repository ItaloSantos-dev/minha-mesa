package com.italosantos.minha_mesa.infra;

import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.repository.UserRepository;
import com.italosantos.minha_mesa.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class SecurityTokenAccessFilter extends OncePerRequestFilter {
    private final UserRepository userRepository;
    private final TokenService tokenService;

    public SecurityTokenAccessFilter(UserRepository userRepository, TokenService tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = this.getToken(request);
        if (token!=null){

            Integer userId = Integer.parseInt(this.tokenService.validateToken(token));
            UserModel userModel = this.userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Deu ruin"));
            Authentication auth = new UsernamePasswordAuthenticationToken(userModel, null, userModel.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        filterChain.doFilter(request, response);
    }

    private String  getToken(HttpServletRequest request){
        if(request.getCookies()==null)
            return null;

        List<Cookie> cookies = List.of(request.getCookies());

        return cookies.stream()
                .filter(cookie -> cookie.getName().equals(SecurityConfiguration.accessTokenCookieKeyName))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

    }
}
