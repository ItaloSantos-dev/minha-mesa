package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.dish_category.CreateDishCategoryRequestDTO;
import com.italosantos.minha_mesa.dto.dish_category.DishCategoryResponseDTO;
import com.italosantos.minha_mesa.exception.AlreadyExistsCategoryOfRestaurantWithNameException;
import com.italosantos.minha_mesa.exception.IllegalParameterException;
import com.italosantos.minha_mesa.exception.ResourceNotFoundException;
import com.italosantos.minha_mesa.exception.UserIsNotOwnerException;
import com.italosantos.minha_mesa.infra.storage.MediaPath;
import com.italosantos.minha_mesa.mapper.DishCategoryMapper;
import com.italosantos.minha_mesa.model.DishCategoryModel;
import com.italosantos.minha_mesa.model.DishModel;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.repository.DishCategoryRepository;
import com.italosantos.minha_mesa.repository.DishRepository;
import com.italosantos.minha_mesa.repository.OwnerRepository;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class DishCategoryService {
    private final DishCategoryRepository dishCategoryRepository;
    private final OwnerRepository ownerRepository;
    private final ImageService imageService;
    private final DishRepository dishRepository;
    private final DishCategoryMapper dishCategoryMapper;

    public DishCategoryService(DishCategoryRepository dishCategoryRepository, OwnerRepository ownerRepository, ImageService imageService, DishRepository dishRepository, DishCategoryMapper dishCategoryMapper) {
        this.dishCategoryRepository = dishCategoryRepository;
        this.ownerRepository = ownerRepository;
        this.imageService = imageService;
        this.dishRepository = dishRepository;
        this.dishCategoryMapper = dishCategoryMapper;
    }
    public String generateSlug(String name) {
        return Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }
    @Transactional
    public DishCategoryResponseDTO createDishCategory(UserModel userModel, CreateDishCategoryRequestDTO createDishCategoryRequestDTO, MultipartFile image){
        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(UserIsNotOwnerException::new);

        if (this.dishCategoryRepository.existsByNameAndRestaurantModelOwnerModelUserModelId(createDishCategoryRequestDTO.name(), ownerModel.getUserModel().getId())) {
            throw new AlreadyExistsCategoryOfRestaurantWithNameException();
        }

        List<DishModel> dishModels = createDishCategoryRequestDTO.dishIds() == null ? null :
                createDishCategoryRequestDTO.dishIds().stream()
                        .map(dishId -> this.dishRepository.findById(dishId)
                                .orElseThrow(() ->new ResourceNotFoundException("Falha ao encontrar um dos pratos a serem adicionados na categoria.")))
                        .toList();

        String imagePath = this.imageService.uploadImage(image, MediaPath.DISH_CATEGORY_PATH);

        DishCategoryModel dishCategoryModel = this.dishCategoryMapper.createToModel(
                createDishCategoryRequestDTO,
                imagePath,
                dishModels,
                ownerModel.getRestaurantModel(),
                this.generateSlug(createDishCategoryRequestDTO.name())

        );

        dishCategoryModel = this.dishCategoryRepository.save(dishCategoryModel);

        String imageLink = this.imageService.getAssignedUrl(dishCategoryModel.getImagePath());

        return this.dishCategoryMapper.modelToResponse(
                dishCategoryModel,
                imageLink
        );

    }
}
