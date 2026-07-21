package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.WorkingScheduleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkingScheduleRepository extends JpaRepository<WorkingScheduleModel, Integer> {
}
