package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.exception.ResourceNotFoundException;
import com.italosantos.minha_mesa.model.ReserveModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.repository.ReserveRepository;
import com.italosantos.minha_mesa.repository.UserRepository;
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

    public UserService(UserRepository userRepository, ReserveRepository reserveRepository) {
        this.userRepository = userRepository;
        this.reserveRepository = reserveRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.userRepository.findByEmail(username);
    }

    public List<ReserveModel> getReservesOfUser(UserModel userModel, Pageable pageable){
        return this.reserveRepository.findByUserModelId(userModel.getId(), pageable).getContent();
    }

    public ReserveModel getReserveOfUserById(UserModel userModel, Integer id){
        return this.reserveRepository.findByIdAndUserModelId(id, userModel.getId())
                .orElseThrow(ResourceNotFoundException::new);
    }
}
