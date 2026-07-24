package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.table.CreateTableRequestDTO;
import com.italosantos.minha_mesa.dto.table.TableResponseDTO;
import com.italosantos.minha_mesa.mapper.TableMapper;
import com.italosantos.minha_mesa.model.TableModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{id}")
    public ResponseEntity<TableResponseDTO> getTableById(@PathVariable Integer id){
        TableModel tableModel = this.tableService.getTableById(id);
        return ResponseEntity.ok(this.tableMapper.modelToResponse(tableModel));
    }

    @PostMapping
    public ResponseEntity<TableResponseDTO> createTable(@AuthenticationPrincipal UserModel userModel, @RequestBody CreateTableRequestDTO createTableRequestDTO){
        TableModel tableModel = this.tableService.createTable(createTableRequestDTO, userModel);
        return ResponseEntity.created(URI.create("/tables" + tableModel.getId())).body(this.tableMapper.modelToResponse(tableModel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTableById(@AuthenticationPrincipal UserModel userModel, @PathVariable  Integer id){
        this.tableService.deleteTableById(userModel, id);
        return ResponseEntity.noContent().build();
    }
}
