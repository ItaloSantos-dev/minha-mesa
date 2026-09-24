package com.italosantos.minha_mesa.repository;

import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReserveRepository extends JpaRepository<ReserveModel, Integer> {
    boolean existsByTableModelIdAndDateAndTimeStartAndTimeEndAndStatus(
            Integer tableModelId,
            LocalDate date,
            LocalTime timeStart,
            LocalTime timeEnd,
            ReserveStatus status
    );

    Page<ReserveModel> findByUserModelId(Integer id, Pageable pageable);
    Page<ReserveModel> findByTableModelRestaurantModelId(Integer id, Pageable pageable);

    Optional<ReserveModel> findByIdAndTableModelRestaurantModelId(Integer id, Integer restaurantId);
    Optional<ReserveModel> findByIdAndUserModelId(Integer id, Integer userId);

    Long countByTableModelRestaurantModelOwnerModelIdAndDate(Integer ownerId, LocalDate date);
    Long countByTableModelRestaurantModelOwnerModelIdAndStatus(Integer ownerId, ReserveStatus reserveStatus, LocalDate date);

    @Query("""
        SELECT COALESCE(SUM(r.numberOfPeople), 0)
        FROM ReserveModel r
        WHERE r.date = :date
        AND r.status IN :statuses
        AND r.tableModel.restaurantModel.id = :restaurantId
    """)
    Long sumNumberOfPeopleByDateAndStatusIn(
            @Param("date") LocalDate date,
            @Param("statuses") List<ReserveStatus> statuses,
            @Param("restaurantId") Integer restaurantId
    );


    @Query("""
        SELECT r
        FROM ReserveModel r
        WHERE  r.tableModel.restaurantModel.id = :restaurantId
        AND r.date = :date
        AND r.timeStart > :actualTime
        AND r.status IN :statuses
    """)
    List<ReserveModel> findByTableModelRestaurantIdAndDateAndTimeStartIsBiggerOfActualTimeAndStatusIn(Integer restaurantId, LocalDate date, LocalTime actualTime, List<ReserveStatus> statuses);


}
