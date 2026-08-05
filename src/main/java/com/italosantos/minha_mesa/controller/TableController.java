package com.italosantos.minha_mesa.controller;

import com.italosantos.minha_mesa.dto.exception.ExceptionResponse;
import com.italosantos.minha_mesa.dto.table.CreateTableRequestDTO;
import com.italosantos.minha_mesa.dto.table.TableResponseDTO;
import com.italosantos.minha_mesa.mapper.TableMapper;
import com.italosantos.minha_mesa.model.TableModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.service.TableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Tag(
        name = "3 - Mesas",
        description = "Operações relacionadas as mesas cadastradas"
)
@RestController
@RequestMapping("tables")
public class TableController {
    private final TableService tableService;
    private final TableMapper tableMapper;

    public TableController(TableService tableService, TableMapper tableMapper) {
        this.tableService = tableService;
        this.tableMapper = tableMapper;
    }

    @Operation(
            summary = "Busca mesas disponíveis, com base nos parâmetros enviados",
            description = "Retorna lista de mesas disponíveis de acordo com, id do restaurante, capacidade da mesa, date e hora de início e fim"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de mesas disponíveis"),
            @ApiResponse(
                    responseCode = "404", description = "Restaurante não encontrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "409", description = "Restaurante não funcionará no dia enviado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400", description = "Algum parâmetro inválido",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @GetMapping
    public ResponseEntity<List<TableResponseDTO>> getTablesAvaliables(
            @RequestParam Integer restaurantId,
            @RequestParam Integer capacity,
            @RequestParam LocalDate date,
            @RequestParam LocalTime timeStart,
            @RequestParam LocalTime timeEnd,
            Pageable pageable
    ){
        List<TableModel> tables = this.tableService.getTablesAvaliables(restaurantId, capacity, date, timeStart, timeEnd, pageable);
        List<TableResponseDTO> response = tables.stream()
                .map(this.tableMapper::modelToResponse)
                .toList();
        return ResponseEntity.ok(response);

    }

    @Operation(
            summary = "Buscar mesa pelo id",
            description = "Retorna dados da mesa com base no id"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mesa encontrada com sucesso"),
            @ApiResponse(
                    responseCode = "404", description = "Mesa não econtrada",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<TableResponseDTO> getTableById(@PathVariable Integer id){
        TableModel tableModel = this.tableService.getTableById(id);
        return ResponseEntity.ok(this.tableMapper.modelToResponse(tableModel));
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Cria uma nova mesa",
            description = "Retorna os dados da nova mesa criada"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Mesa criada com sucesso"),
            @ApiResponse(
                    responseCode = "403", description = "Usuário não possui um restaurante cadastrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "409", description = "Número de mesa já cadastrado",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400", description = "Capacidade inválida para mesa",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )

    })
    @PostMapping
    public ResponseEntity<TableResponseDTO> createTable(@AuthenticationPrincipal UserModel userModel, @RequestBody CreateTableRequestDTO createTableRequestDTO){
        TableModel tableModel = this.tableService.createTable(createTableRequestDTO, userModel);
        return ResponseEntity.created(URI.create("/tables" + tableModel.getId())).body(this.tableMapper.modelToResponse(tableModel));
    }

    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Desativa uma mesa pelo id",
            description = "Retorno vazio, se bem sucedido"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Mesa desativada com sucesso"),
            @ApiResponse(
                    responseCode = "403", description = "Usuário não possui um restaurante cadastrado/Mesa não pertence ao usuário",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404", description = "Mesa não encontrada",
                    content = @Content(
                            schema = @Schema(implementation = ExceptionResponse.class)
                    )
            )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTableById(@AuthenticationPrincipal UserModel userModel, @PathVariable  Integer id){
        this.tableService.deleteTableById(userModel, id);
        return ResponseEntity.noContent().build();
    }
}
