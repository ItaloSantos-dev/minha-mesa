package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<RestaurantModel, Integer> {
    boolean existsByOwnerModelUserModelId(Integer userId);
    boolean existsByOwnerModelUserModelEmail(String email);
    Optional<RestaurantModel> findByOwnerModelUserModelId(Integer userId);

    @Query("""
        SELECT rt
        FROM RestaurantModel rt
        JOIN TableModel tb ON tb.restaurantModel = rt
        JOIN ReserveModel rs ON rs.tableModel = tb
        WHERE rs.userModel.id = :userId
        AND rs.status = :status
        ORDER BY rs.date DESC
    """)
    List<RestaurantModel> findRecentRestaurantsByUserId(
            @Param("userId") Integer userId,
            @Param("status") ReserveStatus status
    );

    List<RestaurantModel> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
