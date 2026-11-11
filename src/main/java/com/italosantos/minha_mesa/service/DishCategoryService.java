package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.dto.dish_category.CreateDishCategoryRequestDTO;
import com.italosantos.minha_mesa.dto.dish_category.DishCategoryResponseDTO;
import com.italosantos.minha_mesa.dto.dish_category.UpdateDishCategoryResponseDTO;
import com.italosantos.minha_mesa.exception.*;
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
import java.util.HashMap;
import java.util.List;

@Slf4j
@Service
public class DishCategoryService {
    private final DishCategoryRepository dishCategoryRepository;
    private final OwnerRepository ownerRepository;
    private final ImageService imageService;
    private final DishRepository dishRepository;
    private final DishCategoryMapper dishCategoryMapper;
    private final DishService dishService;

    public DishCategoryService(DishCategoryRepository dishCategoryRepository, OwnerRepository ownerRepository, ImageService imageService, DishRepository dishRepository, DishCategoryMapper dishCategoryMapper, DishService dishService) {
        this.dishCategoryRepository = dishCategoryRepository;
        this.ownerRepository = ownerRepository;
        this.imageService = imageService;
        this.dishRepository = dishRepository;
        this.dishCategoryMapper = dishCategoryMapper;
        this.dishService = dishService;
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
                imageLink,
                this.dishService.getDishesByDishCategoryId(dishCategoryModel.getId())
        );

    }

    public DishCategoryResponseDTO getDishCategoryById(UserModel userModel, Integer id){
        DishCategoryModel dishCategoryModel = this.dishCategoryRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);

        if (!dishCategoryModel.getActive() && !userModel.getId().equals(dishCategoryModel.getRestaurantModel().getOwnerModel().getUserModel().getId()))
            throw new NotPermitedException("Categoria inativa");

        String imageLink = this.imageService.getAssignedUrl(dishCategoryModel.getImagePath());

        return this.dishCategoryMapper.modelToResponse(dishCategoryModel, imageLink, this.dishService.getDishesByDishCategoryId(dishCategoryModel.getId()));
    }

    @Transactional
    public DishCategoryResponseDTO updateDishCategoryById(UserModel userModel, Integer id, UpdateDishCategoryResponseDTO updateDishCategoryResponseDTO, MultipartFile newImage){
        if (updateDishCategoryResponseDTO.name()==null &&
                updateDishCategoryResponseDTO.updateActive() ==null&&
                updateDishCategoryResponseDTO.dishesToAdd() ==null &&
                updateDishCategoryResponseDTO.dishesToRemove()==null&&
                updateDishCategoryResponseDTO.removeAllDishsOfCategory() == null &&
                (newImage == null || newImage.isEmpty()))
            throw new IllegalParameterException("Todos os campos estão vazios");

        OwnerModel ownerModel = this.ownerRepository.findByUserModelId(userModel.getId())
                .orElseThrow(UserIsNotOwnerException::new);

        DishCategoryModel dishCategoryModel = this.dishCategoryRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);

        if (!ownerModel.getId().equals(dishCategoryModel.getRestaurantModel().getOwnerModel().getId()))
            throw new NotPermitedException();

        String imageLink = this.imageService.getAssignedUrl(dishCategoryModel.getImagePath());

        if (Boolean.TRUE.equals(updateDishCategoryResponseDTO.updateActive())) {
            dishCategoryModel.setActive(!dishCategoryModel.getActive());
            if (!dishCategoryModel.getActive()){
                if (Boolean.TRUE.equals(updateDishCategoryResponseDTO.removeAllDishsOfCategory())){
                    dishCategoryModel.getDishModels()
                            .forEach(dish ->{
                                dish.setDishCategoryModel(null);
                                dish.setActive(false);
                                this.dishRepository.save(dish);
                            });
                    dishCategoryModel.setDishModels(null);
                }
                return this.dishCategoryMapper.modelToResponse(this.dishCategoryRepository.save(dishCategoryModel), imageLink, this.dishService.getDishesByDishCategoryId(dishCategoryModel.getId()));
            }
        }
        else if(updateDishCategoryResponseDTO.dishesToRemove()!=null || updateDishCategoryResponseDTO.dishesToAdd()!=null){
            List<DishModel> dishModelsOfCategory = dishCategoryModel.getDishModels();
            List<DishModel> dishModelsForSave = new ArrayList<>();

            if (updateDishCategoryResponseDTO.dishesToAdd()!=null && updateDishCategoryResponseDTO.dishesToRemove()!=null)
                updateDishCategoryResponseDTO.dishesToAdd()
                        .forEach(dishToAddId -> {
                            if (updateDishCategoryResponseDTO.dishesToRemove().contains(dishToAddId))
                                throw new IllegalParameterException("Você tentou adicionar e remover o mesmo item");
                        });

            if (updateDishCategoryResponseDTO.dishesToRemove()!=null){
                List<DishModel> dishModelsToRemove = this.dishRepository.findAllById(updateDishCategoryResponseDTO.dishesToRemove());
                if (dishModelsToRemove.size()!=updateDishCategoryResponseDTO.dishesToRemove().size())
                    throw new ResourceNotFoundException("Um dos pratos a serem removidos não foi econtrado");

                dishModelsToRemove.forEach(dishModelToRemove ->{
                    if (dishModelToRemove.getDishCategoryModel()==null || !dishModelToRemove.getDishCategoryModel().getId().equals(dishCategoryModel.getId()))
                        throw new IllegalParameterException("Um dos pratos a serem removidos não pertence a categoria em edição.");

                    dishModelToRemove.setDishCategoryModel(null);
                    dishModelsOfCategory.removeIf(dish ->
                            dish.getId().equals(dishModelToRemove.getId())
                    );
                    dishModelsForSave.add(dishModelToRemove);
                });
            }

            if (updateDishCategoryResponseDTO.dishesToAdd()!=null){
                List<DishModel> dishModelsToAdd = this.dishRepository.findAllById(updateDishCategoryResponseDTO.dishesToAdd());

                if (dishModelsToAdd.size()!=updateDishCategoryResponseDTO.dishesToAdd().size())
                    throw new ResourceNotFoundException("Um dos pratos a serem adicionados não foi econtrado");

                dishModelsToAdd.forEach(dishModelToAdd ->{
                    if (dishModelToAdd.getDishCategoryModel()!=null)
                        throw new IllegalParameterException("Um dos pratos a serem adicionados já esta cadastrado em uma categoria");

                    dishModelToAdd.setDishCategoryModel(dishCategoryModel);
                    dishModelsOfCategory.add(dishModelToAdd);
                    dishModelsForSave.add(dishModelToAdd);
                });
            }

            this.dishRepository.saveAll(dishModelsForSave);

        }

        if (updateDishCategoryResponseDTO.name()!= null){
            if (this.dishCategoryRepository.existsByNameAndRestaurantModelOwnerModelUserModelId(updateDishCategoryResponseDTO.name(), ownerModel.getUserModel().getId()))
                throw new AlreadyExistsCategoryOfRestaurantWithNameException();
            dishCategoryModel.setName(updateDishCategoryResponseDTO.name());
            dishCategoryModel.setSlug(this.generateSlug(updateDishCategoryResponseDTO.name()));
        }

        if (newImage!=null && !newImage.isEmpty()){
            String oldImagePath = dishCategoryModel.getImagePath();
            String newImagePath = this.imageService.uploadImage(newImage, MediaPath.DISH_CATEGORY_PATH);
            if (newImagePath==null || newImagePath.isBlank())
                throw new UploadMediaException();
            dishCategoryModel.setImagePath(newImagePath);
            this.imageService.deleteImage(oldImagePath);
        }

        return this.dishCategoryMapper.modelToResponse(this.dishCategoryRepository.save(dishCategoryModel), imageLink, this.dishService.getDishesByDishCategoryId(dishCategoryModel.getId()));
    }



}
