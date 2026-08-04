package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.TableModel;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<TableModel, Integer> {
    boolean existsByNumberAndRestaurantModelOwnerModelId(Integer number, Integer ownerId);
    @Query("""
        SELECT t
            FROM TableModel t
            WHERE NOT EXISTS (
                SELECT 1
                FROM ReserveModel r
                WHERE r.tableModel.id = t.id
                  AND r.date = :date
                  AND r.timeStart = :timeStart
                  AND r.status <> :status
            )
            AND t.capacity >= :capacity
            AND t.restaurantModel.id = :restaurantId
            AND t.active = TRUE
""")
    Page<TableModel> findAvailableTables(
            @Param("date") LocalDate date,
            @Param("timeStart") LocalTime timeStart,
            @Param("status") ReserveStatus status,
            @Param("capacity") Integer capacity,
            @Param("restaurantId") Integer restaurantId,
            Pageable pageable
    );
}
