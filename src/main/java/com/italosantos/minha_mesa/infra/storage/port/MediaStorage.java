package com.italosantos.minha_mesa.infra.storage.port;

import org.springframework.web.multipart.MultipartFile;

public interface MediaStorage {
    void uploadMedia(MultipartFile file, String path);

    String getAssignedUrl(String path);

    void deleteMedia(String path);
}
