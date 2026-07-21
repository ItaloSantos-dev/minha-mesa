package com.italosantos.minha_mesa.model;

import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Table(name = "tb_reserve")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReserveModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "table_id")
    private TableModel tableModel;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel userModel;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "time_start", nullable = false)
    private LocalTime time_start;

    @Column(name = "time_end", nullable = false)
    private LocalTime time_end;

    @Column(name = "number_of_people", nullable = false)
    private Integer numberOfPeople;

    @Column(name = "observation")
    private String observation;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReserveStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

}
