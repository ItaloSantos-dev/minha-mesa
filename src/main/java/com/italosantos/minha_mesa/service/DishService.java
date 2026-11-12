package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.dish.CreateDishRequestDTO;
import com.italosantos.minha_mesa.dto.dish.DishResponseDTO;
import com.italosantos.minha_mesa.dto.dish.UpdateDishRequestDTO;
import com.italosantos.minha_mesa.dto.rate_dish.RateDishResponseDTO;
import com.italosantos.minha_mesa.exception.*;
import com.italosantos.minha_mesa.infra.storage.MediaPath;
import com.italosantos.minha_mesa.mapper.DishMapper;
import com.italosantos.minha_mesa.mapper.RateDishMapper;
import com.italosantos.minha_mesa.model.*;
import com.italosantos.minha_mesa.repository.DishCategoryRepository;
import com.italosantos.minha_mesa.repository.DishRepository;
import com.italosantos.minha_mesa.repository.OwnerRepository;
import com.italosantos.minha_mesa.repository.RateDishRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
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
    private final RateDishMapper rateDishMapper;
    private final RateDishRepository rateDishRepository;


    public DishService(DishRepository dishRepository, ImageService imageService, OwnerRepository ownerRepository, DishCategoryRepository dishCategoryRepository, DishMapper dishMapper, RateDishMapper rateDishMapper, RateDishRepository rateDishRepository) {
        this.dishRepository = dishRepository;
        this.imageService = imageService;
        this.ownerRepository = ownerRepository;
        this.dishCategoryRepository = dishCategoryRepository;
        this.dishMapper = dishMapper;
        this.rateDishMapper = rateDishMapper;
        this.rateDishRepository = rateDishRepository;
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

    public DishResponseDTO getDishById(Integer id, UserModel userModel){
        DishModel dishModel = this.dishRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);
        if(!dishModel.getActive() && !userModel.getId().equals(dishModel.getRestaurantModel().getOwnerModel().getUserModel().getId()))
            throw new NotPermitedException("Este prato está inativo.");
        String imageLink = this.imageService.getAssignedUrl(dishModel.getImagePath());
        return this.dishMapper.modelToResponse(dishModel, imageLink);
    }


    @Transactional
    public DishResponseDTO updateDishById(
            UserModel userModel,
            Integer id,
            UpdateDishRequestDTO updateDishRequestDTO,
            MultipartFile newImage
    ) {

        if (updateDishRequestDTO.name() == null &&
                updateDishRequestDTO.dishCategory() == null &&
                updateDishRequestDTO.description() == null &&
                updateDishRequestDTO.preparationTime() == null &&
                updateDishRequestDTO.price() == null &&
                updateDishRequestDTO.active() == null &&
                (newImage == null || newImage.isEmpty())
        )
            throw new IllegalParameterException("Todos os campos estão vazios.");

        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(UserIsNotOwnerException::new);

        DishModel dishModel = this.dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Não foi possível encontrar um prato com esse id."));

        if (!ownerModel.getId().equals(dishModel.getRestaurantModel().getOwnerModel().getId()))
            throw new NotPermitedException();


        String newSlug = null;
        if (updateDishRequestDTO.name() != null) {

            if (updateDishRequestDTO.name().isBlank())
                throw new IllegalParameterException("O nome do prato não pode estar vazio.");

            if (this.dishRepository.existsByNameAndRestaurantModelId(
                    updateDishRequestDTO.name(),
                    ownerModel.getRestaurantModel().getId()
            ) && !dishModel.getName().equalsIgnoreCase(updateDishRequestDTO.name()))
                throw new AlreadyExistsDishWithNameOfRestaurantException();
            newSlug = this.generateSlug(updateDishRequestDTO.name());
        }

        DishCategoryModel newDishCategoryModel = null;
        if (updateDishRequestDTO.dishCategory() != null) {

            DishCategoryModel dishCategoryModel = this.dishCategoryRepository
                    .findById(updateDishRequestDTO.dishCategory())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Não foi possível encontrar uma categoria com esse id."
                    ));

            if (!dishCategoryModel.getRestaurantModel().getId()
                    .equals(ownerModel.getRestaurantModel().getId()))
                throw new NotPermitedException();

            if (!dishCategoryModel.getActive())
                throw new IllegalParameterException("Não é possível adicionar um prato a uma categoria inativa.");

            newDishCategoryModel = dishCategoryModel;
        }

        if (updateDishRequestDTO.preparationTime() != null && updateDishRequestDTO.preparationTime() < 120)
            throw new IllegalParameterException("O tempo mínimo de preparo para um prato é 2 minutos.");

        if (updateDishRequestDTO.price() != null && updateDishRequestDTO.price().compareTo(BigDecimal.ONE) < 0)
            throw new IllegalParameterException("O valor mínimo de um prato é R$ 1,00.");


        String newImagePath = null;
        if (newImage != null && !newImage.isEmpty()) {

            String oldImagePath = dishModel.getImagePath();

            String imagePath = this.imageService.uploadImage(newImage, MediaPath.DISH);

            if (imagePath == null || imagePath.isBlank())
                throw new UploadMediaException();

            newImagePath = imagePath;

            this.imageService.deleteImage(oldImagePath);

        }

       DishModel dishModelSaved = this.dishMapper.updateToModel(
               dishModel,
               updateDishRequestDTO,
               newImagePath,
               newSlug,
               newDishCategoryModel

       );
        String imageLink = this.imageService.getAssignedUrl(dishModelSaved.getImagePath());
        return this.dishMapper.modelToResponse(dishModel, imageLink);
    }

    public List<RateDishResponseDTO> getRatesDishByDishId(Integer id, Pageable pageable){
       List<RateDishModel> ratesDish = this.rateDishRepository.findByReserveDishModelDishModelId(id, pageable).getContent();

        return ratesDish.stream()
                .map(this.rateDishMapper::modelToResponse)
                .toList();

    }
}
