package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.dish.CreateDishRequestDTO;
import com.italosantos.minha_mesa.dto.dish.DishResponseDTO;
import com.italosantos.minha_mesa.exception.AlreadyExistsDishWithNameOfRestaurantException;
import com.italosantos.minha_mesa.exception.IllegalParameterException;
import com.italosantos.minha_mesa.exception.ResourceNotFoundException;
import com.italosantos.minha_mesa.exception.UserIsNotOwnerException;
import com.italosantos.minha_mesa.infra.storage.MediaPath;
import com.italosantos.minha_mesa.mapper.DishMapper;
import com.italosantos.minha_mesa.model.DishCategoryModel;
import com.italosantos.minha_mesa.model.DishModel;
import com.italosantos.minha_mesa.model.OwnerModel;
import com.italosantos.minha_mesa.model.UserModel;
import com.italosantos.minha_mesa.repository.DishCategoryRepository;
import com.italosantos.minha_mesa.repository.DishRepository;
import com.italosantos.minha_mesa.repository.OwnerRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.List;

@Service
public class DishService {
    private final DishRepository dishRepository;
    private final ImageService imageService;
    private final OwnerRepository ownerRepository;
    private final DishCategoryRepository dishCategoryRepository;
    private final DishMapper dishMapper;

    public DishService(DishRepository dishRepository, ImageService imageService, OwnerRepository ownerRepository, DishCategoryRepository dishCategoryRepository, DishMapper dishMapper) {
        this.dishRepository = dishRepository;
        this.imageService = imageService;
        this.ownerRepository = ownerRepository;
        this.dishCategoryRepository = dishCategoryRepository;
        this.dishMapper = dishMapper;
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

    public List<DishResponseDTO> getDishesByDishCategoryId(Integer id){
        List<DishModel> dishModels =this.dishRepository.findAllByDishCategoryModelId(id);
        return dishModels.stream()
                .map(dish -> {
                    String imageLink = this.imageService.getAssignedUrl(dish.getImagePath());
                    return this.dishMapper.modelToResponse(dish, imageLink);
                })
                .toList();
    }

    public DishResponseDTO createDish(UserModel userModel, CreateDishRequestDTO createDishRequestDTO, MultipartFile image){
        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(UserIsNotOwnerException::new);

        DishCategoryModel dishCategoryModel = null;

        boolean hasCategoryId = createDishRequestDTO.dishCategory()!=null;

        if (hasCategoryId )
            dishCategoryModel = this.dishCategoryRepository.findById(createDishRequestDTO.dishCategory())
                    .orElseThrow(() -> new ResourceNotFoundException("Não foi possível encontrar uma categoria com esse id."));

        if (hasCategoryId && this.dishRepository.existsByNameAndRestaurantModelId(createDishRequestDTO.name(), ownerModel.getRestaurantModel().getId()))
            throw new AlreadyExistsDishWithNameOfRestaurantException();

        if (createDishRequestDTO.preparationTime()<120)
            throw new IllegalParameterException("O tempo mínimo de preparo para um prato é 2 minutos.");

        if (createDishRequestDTO.price().compareTo(BigDecimal.ONE)<0)
            throw new IllegalParameterException("O valor mínimo de um prato é R$ 1,00.");

        String imagePath = this.imageService.uploadImage(image, MediaPath.DISH);
        DishModel dishModel = this.dishMapper.createToModel(createDishRequestDTO, ownerModel.getRestaurantModel(), dishCategoryModel, this.generateSlug(createDishRequestDTO.name()), imagePath);

        this.dishRepository.save(dishModel);
        String imageLink = this.imageService.getAssignedUrl(dishModel.getImagePath());

        return this.dishMapper.modelToResponse(dishModel, imageLink);
    }

    public DishResponseDTO getDishById(Integer id){
        DishModel dishModel = this.dishRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);

        String imageLink = this.imageService.getAssignedUrl(dishModel.getImagePath());
        return this.dishMapper.modelToResponse(dishModel, imageLink);
    }
}
