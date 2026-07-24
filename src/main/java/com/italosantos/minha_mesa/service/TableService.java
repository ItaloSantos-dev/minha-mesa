package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.table.CreateTableRequestDTO;
import com.italosantos.minha_mesa.exception.AlreadyExistTableWithNumberException;
import com.italosantos.minha_mesa.exception.NotPermitedException;
import com.italosantos.minha_mesa.exception.ResourceNotFoundException;
import com.italosantos.minha_mesa.mapper.TableMapper;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.TableModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.repository.OwnerRepository;
import com.italosantos.minha_mesa.repository.TableRepository;
import org.springframework.stereotype.Service;

@Service
public class TableService {
    private final TableRepository tableRepository;
    private final OwnerRepository ownerRepository;
    private final TableMapper tableMapper;

    public TableService(TableRepository tableRepository, OwnerRepository ownerRepository, TableMapper tableMapper) {
        this.tableRepository = tableRepository;
        this.ownerRepository = ownerRepository;
        this.tableMapper = tableMapper;
    }

    public TableModel createTable(CreateTableRequestDTO createTableRequestDTO, UserModel userModel){
        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(NotPermitedException::new);
        if (this.tableRepository.existsByNumberAndRestaurantModelOwnerModelId(createTableRequestDTO.number(), ownerModel.getId()))
            throw new AlreadyExistTableWithNumberException();
        TableModel tableModel = this.tableMapper.createToModel(createTableRequestDTO, ownerModel.getRestaurantModel());

        return this.tableRepository.save(tableModel);
    }

    public void deleteTableById(UserModel userModel, Integer id){
        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(NotPermitedException::new);

        TableModel tableModel = this.tableRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);

        if (! ownerModel.getUserModel().getId().equals(userModel.getId()))
            throw new NotPermitedException();

        tableModel.setActive(false);
        this.tableRepository.save(tableModel);
    }
}
