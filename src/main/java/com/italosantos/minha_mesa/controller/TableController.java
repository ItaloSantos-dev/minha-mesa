package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.table.CreateTableRequestDTO;
import com.italosantos.minha_mesa.dto.table.TableResponseDTO;
import com.italosantos.minha_mesa.mapper.TableMapper;
import com.italosantos.minha_mesa.model.TableModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("tables")
public class TableController {
    private final TableService tableService;
    private final TableMapper tableMapper;

    public TableController(TableService tableService, TableMapper tableMapper) {
        this.tableService = tableService;
        this.tableMapper = tableMapper;
    }

    @PostMapping
    public ResponseEntity<TableResponseDTO> createTable(@AuthenticationPrincipal UserModel userModel, @RequestBody CreateTableRequestDTO createTableRequestDTO){
        TableModel tableModel = this.tableService.createTable(createTableRequestDTO, userModel);
        return ResponseEntity.created(URI.create("/tables" + tableModel.getId())).body(this.tableMapper.modelToResponse(tableModel));
    }
}
