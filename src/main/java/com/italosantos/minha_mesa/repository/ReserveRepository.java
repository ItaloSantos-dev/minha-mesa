package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.ReserveModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReserveRepository extends JpaRepository<ReserveModel, Integer> {
}
