package com.italosantos.minha_mesa.mapper;

import com.italosantos.minha_mesa.dto.table.CreateTableRequestDTO;
import com.italosantos.minha_mesa.dto.table.TableResponseDTO;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.model.TableModel;
import org.springframework.stereotype.Component;

@Component
public class TableMapper {
    public TableModel createToModel(CreateTableRequestDTO createTableRequestDTO, RestaurantModel restaurantModel){
        TableModel tableModel = new TableModel();
        tableModel.setCapacity(createTableRequestDTO.capacity());
        tableModel.setNumber(createTableRequestDTO.number());
        tableModel.setActive(true);
        tableModel.setRestaurantModel(restaurantModel);
        return tableModel;
    }

    public TableResponseDTO modelToResponse(TableModel tableModel){
        return new TableResponseDTO(
                tableModel.getId(),
                tableModel.getNumber(),
                tableModel.getCapacity()
        );
    }
}
