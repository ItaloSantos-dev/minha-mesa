package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.exception.UserAlreadyIsOwnerException;
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


    public OwnerService(OwnerRepository ownerRepository, UserRepository userRepository, OwnerMapper ownerMapper) {
        this.ownerRepository = ownerRepository;
        this.userRepository = userRepository;
        this.ownerMapper = ownerMapper;
    }

    @Transactional
    public OwnerModel createOwner(UserModel userModel, CreateOwnerDTO createOwnerDTO){
        if (userModel.getRole()== UserRole.OWNER)
            throw new UserAlreadyIsOwnerException();
        OwnerModel ownerModel = this.ownerMapper.createToModel(userModel, createOwnerDTO);
        this.ownerRepository.save(ownerModel);
        userModel.setRole(UserRole.OWNER);
        this.userRepository.save(userModel);
        return ownerModel;
    }
}
