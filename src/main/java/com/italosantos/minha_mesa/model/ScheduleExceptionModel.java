package com.italosantos.minha_mesa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Table(name = "tb_schedule_exception")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleExceptionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private RestaurantModel restaurantModel;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "reason", nullable = false)
    private String reason;

    @Column(name="active", nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
