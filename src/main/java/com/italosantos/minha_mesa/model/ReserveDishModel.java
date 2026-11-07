package com.italosantos.minha_mesa.model;

import com.italosantos.minha_mesa.model.enums.ReserveDishStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table(name = "tb_reserve_dish")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReserveDishModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "reserve_id", nullable = false)
    private ReserveModel reserveModel;

    @ManyToOne
    @JoinColumn(name = "dish_id", nullable = false)
    private DishModel dishModel;

    @Column(name = "dish_price", nullable = false, scale = 10, precision = 2)
    private BigDecimal dishPrice;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    private ReserveDishStatus status;

    @Min(1)
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "reserveDishModel")
    private RateDishModel rateDishModel;
}
