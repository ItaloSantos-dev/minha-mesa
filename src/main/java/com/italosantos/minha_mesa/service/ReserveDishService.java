package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.reserve_dish.CreateReserveDishRequestDTO;
import com.italosantos.minha_mesa.dto.reserve_dish.ReserveDishResponseDTO;
import com.italosantos.minha_mesa.dto.reserve_dish.UpdateReserveDishRequestDTO;
import com.italosantos.minha_mesa.exception.*;
import com.italosantos.minha_mesa.mapper.ReserveDishMapper;
import com.italosantos.minha_mesa.model.*;
import com.italosantos.minha_mesa.model.enums.ReserveDishStatus;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import com.italosantos.minha_mesa.repository.DishRepository;
import com.italosantos.minha_mesa.repository.OwnerRepository;
import com.italosantos.minha_mesa.repository.ReserveDishRepository;
import com.italosantos.minha_mesa.repository.ReserveRepository;
import org.springframework.stereotype.Service;

import java.util.function.BiFunction;

@Service
public class ReserveDishService {
    private final ReserveDishRepository reserveDIshRepository;
    private final ReserveRepository reserveRepository;
    private final DishRepository dishRepository;
    private final ReserveDishMapper reserveDishMapper;
    private final OwnerRepository ownerRepository;

    public ReserveDishService(
            ReserveDishRepository reserveDIshRepository,
            ReserveRepository reserveRepository,
            DishRepository dishRepository,
            ReserveDishMapper reserveDishMapper, OwnerRepository ownerRepository
    ) {
        this.reserveDIshRepository = reserveDIshRepository;
        this.reserveRepository = reserveRepository;
        this.dishRepository = dishRepository;
        this.reserveDishMapper = reserveDishMapper;
        this.ownerRepository = ownerRepository;
    }

    public ReserveDishResponseDTO createReserveDish(
            UserModel userModel,
            CreateReserveDishRequestDTO createReserveDishRequestDTO
    ) {
        if (this.reserveDIshRepository.existsByReserveModelIdAndDishModelId(createReserveDishRequestDTO.reserveId(), createReserveDishRequestDTO.dishId()))
            throw new AlreadyExistsReserveDishWithReserveAndDishException();

        ReserveModel reserveModel = this.reserveRepository.findById(createReserveDishRequestDTO.reserveId())
                .orElseThrow(() -> new ResourceNotFoundException("Não foi possível encontrar uma reserva com esse id."));

        DishModel dishModel = this.dishRepository.findById(createReserveDishRequestDTO.dishId())
                .orElseThrow(() -> new ResourceNotFoundException("Não foi possível econtrar nenhum prato com esse id."));


        if (!dishModel.getActive())
            throw new DishIsNotActive();

        if (!dishModel.getRestaurantModel().getOwnerModel().getUserModel().getId().equals(userModel.getId()))
            throw new DishIsNotYourRestaurantException();

        if (!reserveModel.getTableModel().getRestaurantModel().getOwnerModel().getUserModel().getId().equals(userModel.getId()))
            throw new ReserveIsNotYourRestaurantException();

        if (createReserveDishRequestDTO.quantity() == null || createReserveDishRequestDTO.quantity() <= 0)
            throw new IllegalParameterException("A quantidade do prato deve ser maior que zero");

        if (reserveModel.getStatus() != ReserveStatus.IN_PROGRESS)
            throw new ReserveIsNotInProgressException();

        ReserveDishModel reserveDishModel = this.reserveDishMapper.createToModel(
                createReserveDishRequestDTO,
                reserveModel,
                dishModel
        );
        reserveDishModel = this.reserveDIshRepository.save(reserveDishModel);

        return this.reserveDishMapper.modelToResponse(reserveDishModel);
    }

    public ReserveDishResponseDTO updateStatusById(UserModel userModel, Integer id, UpdateReserveDishRequestDTO updateReserveDishRequestDTO){

        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(UserIsNotOwnerException::new);

        boolean allFieldsIsNull = updateReserveDishRequestDTO.addQuantity()==null && updateReserveDishRequestDTO.addCanceledQuantity()==null && updateReserveDishRequestDTO.addCompletedQuantity() == null;
        boolean allFieldsIsZero =
                (updateReserveDishRequestDTO.addQuantity() != null && updateReserveDishRequestDTO.addQuantity() == 0) &&
                (updateReserveDishRequestDTO.addCanceledQuantity() != null && updateReserveDishRequestDTO.addCanceledQuantity() == 0) &&
                (updateReserveDishRequestDTO.addCompletedQuantity() != null && updateReserveDishRequestDTO.addCompletedQuantity() == 0);

        boolean haveFieldWithMinusZero =
                (updateReserveDishRequestDTO.addQuantity() != null && updateReserveDishRequestDTO.addQuantity() < 0) ||
                        (updateReserveDishRequestDTO.addCanceledQuantity() != null && updateReserveDishRequestDTO.addCanceledQuantity() < 0) ||
                        (updateReserveDishRequestDTO.addCompletedQuantity() != null && updateReserveDishRequestDTO.addCompletedQuantity() < 0);

        if (allFieldsIsNull || allFieldsIsZero || haveFieldWithMinusZero)
            throw new IllegalParameterException("Você não enviou nenhuma alteração ou enviou um valor menor que 0.");

        if (updateReserveDishRequestDTO.addCanceledQuantity()!=null && updateReserveDishRequestDTO.addQuantity()!=null)
            throw new IllegalParameterException("Você não pode aumentar a quantidade e cancelar pratos simultaneamente");

        ReserveDishModel reserveDishModel = this.reserveDIshRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);

        if (!reserveDishModel.getReserveModel().getTableModel().getRestaurantModel().getId().equals(ownerModel.getId()))
            throw new NotPermitedException();

        if (reserveDishModel.getReserveModel().getStatus()!=ReserveStatus.IN_PROGRESS)
            throw new ReserveIsNotInProgressException();

        int newQuantityCompleted = reserveDishModel.getCompletedQuantity()
                + (updateReserveDishRequestDTO.addCompletedQuantity() != null
                ? updateReserveDishRequestDTO.addCompletedQuantity() : 0);

        int newQuantityCanceled = reserveDishModel.getCanceledQuantity()
                + (updateReserveDishRequestDTO.addCanceledQuantity() != null
                ? updateReserveDishRequestDTO.addCanceledQuantity() : 0);

        if (newQuantityCompleted + newQuantityCanceled > reserveDishModel.getQuantity()) {
            throw new IllegalParameterException(
                    "A soma das quantidades canceladas e completas ultrapassa a quantidade total de pratos"
            );
        }



        reserveDishModel = this.reserveDishMapper.updateToModel(reserveDishModel, this.getStatus(reserveDishModel, updateReserveDishRequestDTO), updateReserveDishRequestDTO);

        ReserveDishModel reserveDishSaved = this.reserveDIshRepository.save(reserveDishModel);

        return this.reserveDishMapper.modelToResponse(reserveDishSaved);
    }

    private ReserveDishStatus getStatus(ReserveDishModel reserveDishModel, UpdateReserveDishRequestDTO updateReserveDishRequestDTO){
        int newQuantity = reserveDishModel.getQuantity()
                + (updateReserveDishRequestDTO.addQuantity() != null ? updateReserveDishRequestDTO.addQuantity() : 0);

        int newCanceledQuantity = reserveDishModel.getCanceledQuantity()
                + (updateReserveDishRequestDTO.addCanceledQuantity() != null ? updateReserveDishRequestDTO.addCanceledQuantity() : 0);

        int newCompletedQuantity = reserveDishModel.getCompletedQuantity()
                + (updateReserveDishRequestDTO.addCompletedQuantity() != null ? updateReserveDishRequestDTO.addCompletedQuantity() : 0);

        if (newCanceledQuantity == newQuantity) {
            return ReserveDishStatus.CANCELED;
        } else if (newCanceledQuantity + newCompletedQuantity == newQuantity) {
            return ReserveDishStatus.COMPLETED;
        } else {
            return ReserveDishStatus.PENDING;
        }

    }

    public ReserveDishResponseDTO getReserveDishById(UserModel userModel, Integer id){

        ReserveDishModel reserveDishModel =  this.reserveDIshRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);

        boolean userIsOwner = userModel.getId().equals(reserveDishModel.getDishModel().getRestaurantModel().getOwnerModel().getUserModel().getId());

        boolean userIsClient = userModel.getId().equals(reserveDishModel.getReserveModel().getUserModel().getId());

        if (!userIsOwner && !userIsClient)
            throw new ResourceNotFoundException();

        if (!reserveDishModel.getDishModel().getActive())
            throw new NotPermitedException("O prato deste comentário está inativo.");

        return this.reserveDishMapper.modelToResponse(reserveDishModel);

    }
}
