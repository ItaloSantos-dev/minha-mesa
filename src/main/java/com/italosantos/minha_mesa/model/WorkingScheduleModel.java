package com.italosantos.minha_mesa.model;

import com.italosantos.minha_mesa.model.enums.DayOfWeek;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Table(name = "tb_working_schedule")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkingScheduleModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private RestaurantModel restaurantModel;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_week", nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(name = "time_start", nullable = false)
    private LocalTime time_start;

    @Column(name = "time_end", nullable = false)
    private LocalTime time_end;


}
