package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserModel ,Integer> {

    UserModel findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    @Query("""
        SELECT DISTINCT u
        FROM UserModel u
        JOIN ReserveModel r ON r.userModel = u
        WHERE r.tableModel.restaurantModel.id = :restaurantId
""")
    List<UserModel> findUsersWhereHaveReserveInRestaurant(Integer restaurantId);
}
