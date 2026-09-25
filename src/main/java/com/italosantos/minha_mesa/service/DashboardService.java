package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.dashboard.DashboardRestaurantResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.dashboard.real_time_tables_data.RealTimeTablesData;
import com.italosantos.minha_mesa.exception.UserIsNotOwnerException;
import com.italosantos.minha_mesa.infra.RedisCacheConfig;
import com.italosantos.minha_mesa.mapper.ReserveMapper;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.TableModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import com.italosantos.minha_mesa.repository.OwnerRepository;
import com.italosantos.minha_mesa.repository.ReserveRepository;
import com.italosantos.minha_mesa.repository.TableRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class DashboardService {
    private final OwnerRepository ownerRepository;
    private final ReserveRepository reserveRepository;
    private final ReserveMapper reserveMapper;
    private final TableRepository tableRepository;

    public DashboardService(OwnerRepository ownerRepository, ReserveRepository reserveRepository, ReserveMapper reserveMapper, TableRepository tableRepository) {
        this.ownerRepository = ownerRepository;
        this.reserveRepository = reserveRepository;
        this.reserveMapper = reserveMapper;
        this.tableRepository = tableRepository;
    }


    @Cacheable(
            value = RedisCacheConfig.DASHBOARDRESTAURANTCACHENAME,
            key = "#userModel.id"
    )
    public DashboardRestaurantResponseDTO getDashboardRestaurantByUserModel(UserModel userModel){
        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(UserIsNotOwnerException::new);

        OffsetDateTime dateTime = OffsetDateTime.now(ZoneId.of("America/Sao_Paulo"));
        Long totalReservations = this.reserveRepository.countByTableModelRestaurantModelOwnerModelIdAndDate(ownerModel.getId(), dateTime.toLocalDate());
        Long scheduledReservations = this.reserveRepository.countByTableModelRestaurantModelOwnerModelIdAndStatus(ownerModel.getId(), ReserveStatus.SCHEDULED, dateTime.toLocalDate());
        Long confirmedReservations = this.reserveRepository.countByTableModelRestaurantModelOwnerModelIdAndStatus(ownerModel.getId(), ReserveStatus.CONFIRMED, dateTime.toLocalDate());
        Long peoplesExpectedInDay = this.reserveRepository.sumNumberOfPeopleByDateAndStatusIn(dateTime.toLocalDate(),List.of(ReserveStatus.SCHEDULED, ReserveStatus.CONFIRMED), ownerModel.getRestaurantModel().getId());
        List<ReserveResponseDTO> nextReservations = this.reserveRepository.findByTableModelRestaurantIdAndDateAndTimeStartIsBiggerOfActualTimeAndStatusIn
            (
                ownerModel.getRestaurantModel().getId(),
                dateTime.toLocalDate(),
                dateTime.toLocalTime(),
                List.of(ReserveStatus.SCHEDULED, ReserveStatus.CONFIRMED)
            ).stream().map(
                this.reserveMapper::modelToResponse
            ).toList();
        Long tablesTotalCount = (long) ownerModel.getRestaurantModel().getTableModels().size();
        Long tablesActiveCount = (long) ownerModel.getRestaurantModel().getTableModels().stream().filter(TableModel::getActive).toList().size();

        Long tablesOccupied = this.tableRepository.countOccupiedTablesByRestaurantIdAndDateAndActualTimeAndStatus(ownerModel.getRestaurantModel().getId(), dateTime.toLocalDate(), dateTime.toLocalTime(), List.of(ReserveStatus.SCHEDULED, ReserveStatus.CONFIRMED));
        RealTimeTablesData realTimeTablesData = new RealTimeTablesData(
            tablesOccupied,
            tablesActiveCount-tablesOccupied,
            dateTime
        );

        return  new DashboardRestaurantResponseDTO(
                ownerModel.getRestaurantModel().getName(),
                totalReservations,
                scheduledReservations,
                confirmedReservations,
                peoplesExpectedInDay,
                nextReservations,
                tablesTotalCount,
                tablesActiveCount,
                realTimeTablesData,
                dateTime.toLocalDate()
        );

    }
}
