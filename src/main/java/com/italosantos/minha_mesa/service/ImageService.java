package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.infra.storage.MediaPath;
import com.italosantos.minha_mesa.infra.storage.port.MediaStorage;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class ImageService {
    private final MediaStorage mediaStorage;

    private final List<String> EXTENSIONS_IMAGE_ACCEPTDES = Arrays.asList("image/jpeg", "image/png", "image/gif");

    public ImageService(MediaStorage mediaStorage) {
        this.mediaStorage = mediaStorage;
    }




    private void validateImage(MultipartFile image){
        if (!this.EXTENSIONS_IMAGE_ACCEPTDES.contains(image.getContentType()))
            throw new IllegalArgumentException("Formato de arquivo não suportado");
    }

    public String uploadImage(MultipartFile image, MediaPath mediaPath){
        this.validateImage(image);

        UUID objectId = UUID.randomUUID();
        String extension = image.getContentType().split("/")[1];

        String path = mediaPath.getPath().toLowerCase() + "/" + objectId + "." + extension;

        this.mediaStorage.uploadMedia(image, path);
        return path;
    }

    public String getAssignedUrl(String imagePath){
        return this.mediaStorage.getAssignedUrl(imagePath);
    }
}
