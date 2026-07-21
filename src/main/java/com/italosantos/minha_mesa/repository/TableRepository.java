package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.TableModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TableRepository extends JpaRepository<TableModel, Integer> {
}
