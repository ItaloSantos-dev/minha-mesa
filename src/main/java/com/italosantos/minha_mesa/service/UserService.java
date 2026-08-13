package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.exception.ResourceNotFoundException;
import com.italosantos.minha_mesa.infra.RedisCacheConfig;
import com.italosantos.minha_mesa.mapper.ReserveMapper;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.repository.ReserveRepository;
import com.italosantos.minha_mesa.repository.UserRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final ReserveRepository reserveRepository;
    private final ReserveMapper reserveMapper;

    public UserService(UserRepository userRepository, ReserveRepository reserveRepository, ReserveMapper reserveMapper) {
        this.userRepository = userRepository;
        this.reserveRepository = reserveRepository;
        this.reserveMapper = reserveMapper;
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
}
