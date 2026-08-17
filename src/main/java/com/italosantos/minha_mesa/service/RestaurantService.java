package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.auth.RegisterRequestDTO;
import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.RestaurantResponseDTO;
import com.italosantos.minha_mesa.dto.user.UserResponseDTO;
import com.italosantos.minha_mesa.dto.working_schedule.WorkingScheduleResponseDTO;
import com.italosantos.minha_mesa.exception.*;
import com.italosantos.minha_mesa.dto.restaurant.CreateRestaurantRequestDTO;
import com.italosantos.minha_mesa.infra.RedisCacheConfig;
import com.italosantos.minha_mesa.mapper.ReserveMapper;
import com.italosantos.minha_mesa.mapper.RestaurantMapper;
import com.italosantos.minha_mesa.mapper.WorkingScheduleMapper;
import com.italosantos.minha_mesa.model.*;
import com.italosantos.minha_mesa.model.enums.UserRole;
import com.italosantos.minha_mesa.repository.*;
import org.jspecify.annotations.Nullable;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RestaurantService {
    private final OwnerService ownerService;
    private final RestaurantMapper restaurantMapper;
    private final RestaurantRepository restaurantRepository;
    private final OwnerRepository ownerRepository;
    private final ReserveRepository reserveRepository;
    private final WorkingScheduleRepository workingScheduleRepository;
    private final ReserveMapper reserveMapper;
    private final WorkingScheduleMapper workingScheduleMapper;
    private final AuthService authService;
    private final UserRepository userRepository;

    public RestaurantService(OwnerService ownerService, RestaurantMapper restaurantMapper, RestaurantRepository restaurantRepository, OwnerRepository ownerRepository, ReserveRepository reserveRepository, WorkingScheduleRepository workingScheduleRepository, ReserveMapper reserveMapper, WorkingScheduleMapper workingScheduleMapper, AuthService authService, UserRepository userRepository) {
        this.ownerService = ownerService;
        this.restaurantMapper = restaurantMapper;
        this.restaurantRepository = restaurantRepository;
        this.ownerRepository = ownerRepository;
        this.reserveRepository = reserveRepository;
        this.workingScheduleRepository = workingScheduleRepository;
        this.reserveMapper = reserveMapper;
        this.workingScheduleMapper = workingScheduleMapper;
        this.authService = authService;
        this.userRepository = userRepository;
    }


    @Transactional
    public RestaurantResponseDTO createRestaurant(CreateRestaurantRequestDTO createRestaurantRequestDTO, @Nullable UserModel userModel){
        UserModel realUser;
        if (userModel!=null){
            if (userModel.getRole()== UserRole.OWNER)
                throw new OwnerAlreadyHaveRestaurantException();
            realUser=userModel;
        }
        else if (createRestaurantRequestDTO.ownerData().userData()!=null) {
            UserResponseDTO userResponseDTO = this.authService.register(createRestaurantRequestDTO.ownerData().userData());
            realUser = this.userRepository.findById(userResponseDTO.id())
                    .orElseThrow(ResourceNotFoundException::new);
        }
        else
            throw new IllegalParameterException();


        OwnerModel ownerModel = this.ownerService.createOwner(createRestaurantRequestDTO.ownerData(), realUser);
        RestaurantModel restaurantModel = this.restaurantMapper.createToModel(createRestaurantRequestDTO, ownerModel);
        return this.restaurantMapper.modelToResponse(this.restaurantRepository.save(restaurantModel));
    }
    @Cacheable(
            value = RedisCacheConfig.RESTAURANTCACHENAME,
            key = "#id"
    )
    public RestaurantResponseDTO getRestaurantById(Integer id){
        return this.restaurantMapper.modelToResponse(
                this.restaurantRepository.findById(id)
                        .orElseThrow(() -> new RestaurantNotFoundException(id))
        );
    }

    @Cacheable(
            value = RedisCacheConfig.RESERVESRESTAURANTCACHENAME,
            key = "#userModel.id + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort"

    )
    public List<ReserveResponseDTO> getReservesOfRestaurant(UserModel userModel, Pageable pageable){
        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(UserIsNotOwnerException::new);

        List<ReserveModel> reserves = this.reserveRepository.findByTableModelRestaurantModelId(ownerModel.getRestaurantModel().getId(), pageable).getContent();

        return reserves.stream()
                .map(this.reserveMapper::modelToResponse)
                .toList();
    }

    public ReserveResponseDTO getReserveOfRestaurantById(UserModel userModel, Integer id){
        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(UserIsNotOwnerException::new);

        ReserveModel reserveModel = this.reserveRepository.findByIdAndTableModelRestaurantModelId(id, ownerModel.getRestaurantModel().getId())
                .orElseThrow(ResourceNotFoundException::new);
        return this.reserveMapper.modelToResponse(reserveModel);
    }

    public List<WorkingScheduleResponseDTO> getDaysWorkingOfRestaurantById(Integer id, Pageable pageable){
        if (! this.restaurantRepository.existsById(id))
            throw new ResourceNotFoundException();
        List<WorkingScheduleModel> workingScheduleModels = this.workingScheduleRepository.findByRestaurantModelId(id, pageable).getContent();

        return workingScheduleModels.stream()
                .map(this.workingScheduleMapper::modelToResponse)
                .toList();
    }

    public void deleteRestaurantByUser(UserModel userModel){
        RestaurantModel restaurantModel = this.restaurantRepository.findByOwnerModelUserModelId(userModel.getId())
                .orElseThrow(UserIsNotOwnerException::new);
        if (!restaurantModel.getActive())
            throw new RestaurantAlreadyHasDesactiveException();
        restaurantModel.setActive(false);
        this.restaurantRepository.save(restaurantModel);
    }
}
