package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.RestaurantResponseDTO;
import com.italosantos.minha_mesa.dto.user.dashboard.DashboardUserResponseDTO;
import com.italosantos.minha_mesa.exception.ResourceNotFoundException;
import com.italosantos.minha_mesa.infra.RedisCacheConfig;
import com.italosantos.minha_mesa.mapper.ReserveMapper;
import com.italosantos.minha_mesa.mapper.RestaurantMapper;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.RestaurantModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.model.enums.ReserveStatus;
import com.italosantos.minha_mesa.repository.ReserveRepository;
import com.italosantos.minha_mesa.repository.RestaurantRepository;
import com.italosantos.minha_mesa.repository.UserRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final ReserveRepository reserveRepository;
    private final ReserveMapper reserveMapper;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;
    private final ImageService imageService;

    public UserService(UserRepository userRepository, ReserveRepository reserveRepository, ReserveMapper reserveMapper, RestaurantRepository restaurantRepository, RestaurantMapper restaurantMapper, ImageService imageService) {
        this.userRepository = userRepository;
        this.reserveRepository = reserveRepository;
        this.reserveMapper = reserveMapper;
        this.restaurantRepository = restaurantRepository;
        this.restaurantMapper = restaurantMapper;
        this.imageService = imageService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.userRepository.findByEmail(username);
    }

    @Cacheable(
            value = RedisCacheConfig.RESERVESUSERSCACHENAME,
            key = "#userModel.id + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort"

    )
    public List<ReserveResponseDTO> getReservesOfUser(UserModel userModel, Pageable pageable){
        List<ReserveModel> reserves = this.reserveRepository.findByUserModelId(userModel.getId(), pageable).getContent();
        return reserves.stream()
                .map(this.reserveMapper::modelToResponse)
                .toList();
    }

    public ReserveResponseDTO getReserveOfUserById(UserModel userModel, Integer id){
        return this.reserveMapper.modelToResponse(
                this.reserveRepository.findByIdAndUserModelId(id, userModel.getId())
                        .orElseThrow(ResourceNotFoundException::new)
        );
    }


    public DashboardUserResponseDTO getDashboardOfUser(UserModel userModel){
        List<RestaurantModel> recentsRestaurants = this.restaurantRepository.findRecentRestaurantsByUserId(userModel.getId(), ReserveStatus.COMPLETED);

        if (recentsRestaurants.size()>5)
            recentsRestaurants = recentsRestaurants.subList(0, 5);

        LocalDate currentDate = LocalDate.now(ZoneId.of("America/Sao_Paulo"));

        List<ReserveModel> reserves = this.reserveRepository.findByUserModelIdAndDate(userModel.getId(), currentDate);

        List<ReserveResponseDTO> reservesToday =  reserves.stream()
                .map(this.reserveMapper::modelToResponse)
                .toList();
        List<RestaurantResponseDTO> recentRestaurantsDTO = recentsRestaurants.stream()
                .map(r ->{
                    String imagePerfilUrl = this.imageService.getAssignedUrl(r.getImagePerfilPath());
                    String imageBannerUrl = this.imageService.getAssignedUrl(r.getImageBannerPath());
                    return this.restaurantMapper.modelToResponse(r, imagePerfilUrl, imageBannerUrl);
                }).toList();

        return new DashboardUserResponseDTO(recentRestaurantsDTO, reservesToday);
    }
}