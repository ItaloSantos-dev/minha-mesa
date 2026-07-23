package com.italosantos.minha_mesa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Table(name = "tb_restaurant")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToMany(mappedBy = "restaurantModel")
    private List<ScheduleExceptionModel> scheduleExceptionModelList = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "owner_id")
    private OwnerModel ownerModel;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone", nullable = false, unique = true)
    private String phone;

    @Column(name = "address", nullable = false)
    private String address;

    @OneToMany(mappedBy = "restaurantModel")
    private List<WorkingScheduleModel> workingScheduleModels = new ArrayList<>();

    @OneToMany(mappedBy = "restaurantModel")
    private List<TableModel> tableModels = new ArrayList<>();
}
