package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.OwnerModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerRepository extends JpaRepository<OwnerModel, Integer> {
}
