package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.owner.CreateOwnerDTO;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.UserModel;
import org.springframework.stereotype.Component;

@Component
public class OwnerMapper {
    public OwnerModel createToModel(UserModel userModel, CreateOwnerDTO createOwnerDTO){
        OwnerModel ownerModel = new OwnerModel();
        ownerModel.setUserModel(userModel);
        ownerModel.setCpf(createOwnerDTO.cpf());
        ownerModel.setNasciment(createOwnerDTO.nasciment());
        return ownerModel;
    }
}
