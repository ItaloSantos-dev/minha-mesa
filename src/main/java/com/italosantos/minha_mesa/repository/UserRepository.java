package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserModel ,Integer> {

    UserModel findByEmail(String email);
    boolean existsByEmail(String email);
}
