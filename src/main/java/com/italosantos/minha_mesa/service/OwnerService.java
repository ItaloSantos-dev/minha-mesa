package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.auth.RegisterRequestDTO;
import com.italosantos.minha_mesa.dto.user.UserResponseDTO;
import com.italosantos.minha_mesa.exception.ResourceNotFoundException;
import com.italosantos.minha_mesa.exception.UserAlreadyIsOwnerException;
import com.italosantos.minha_mesa.dto.owner.CreateOwnerDTO;
import com.italosantos.minha_mesa.mapper.OwnerMapper;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.enums.UserRole;
import com.italosantos.minha_mesa.repository.OwnerRepository;
import com.italosantos.minha_mesa.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OwnerService {
    private final OwnerRepository ownerRepository;
    private final UserRepository userRepository;
    private final OwnerMapper ownerMapper;
    private final AuthService authService;


    public OwnerService(OwnerRepository ownerRepository, UserRepository userRepository, OwnerMapper ownerMapper, AuthService authService) {
        this.ownerRepository = ownerRepository;
        this.userRepository = userRepository;
        this.ownerMapper = ownerMapper;
        this.authService = authService;
    }

    @Transactional
    public OwnerModel createOwner(CreateOwnerDTO createOwnerDTO){
        UserResponseDTO userResponseDTO = this.authService.register(new RegisterRequestDTO(
                createOwnerDTO.name(),
                createOwnerDTO.phone(),
                createOwnerDTO.email(),
                createOwnerDTO.password()
        ));
        UserModel userModel = this.userRepository.findById(userResponseDTO.id())
                .orElseThrow(ResourceNotFoundException::new);

        OwnerModel ownerModel = this.ownerMapper.createToModel(userModel, createOwnerDTO);
        this.ownerRepository.save(ownerModel);
        userModel.setRole(UserRole.OWNER);
        this.userRepository.save(userModel);
        return ownerModel;
    }
}
