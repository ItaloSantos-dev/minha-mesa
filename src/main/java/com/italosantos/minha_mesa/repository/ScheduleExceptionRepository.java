package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.ScheduleExceptionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleExceptionRepository  extends JpaRepository<ScheduleExceptionModel, Integer> {
}
