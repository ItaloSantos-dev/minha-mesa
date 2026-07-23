package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.auth.RegisterRequestDTO;
import com.italosantos.minha_mesa.dto.user.UserResponseDTO;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.enums.UserRole;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserModel registerToModel(RegisterRequestDTO registerRequestDTO, PasswordEncoder encoder){
        UserModel userModel = new UserModel();
        userModel.setName(registerRequestDTO.name());
        userModel.setEmail(registerRequestDTO.email());
        userModel.setPhone(registerRequestDTO.phone());
        userModel.setPassword(encoder.encode(registerRequestDTO.password()));
        userModel.setRole(UserRole.USER);
        return userModel;
    }

    public UserResponseDTO modelToResponse(UserModel userModel){
        return new UserResponseDTO(
                userModel.getId(),
                userModel.getName(),
                userModel.getPhone(),
                userModel.getRole()
        );
    }
}
