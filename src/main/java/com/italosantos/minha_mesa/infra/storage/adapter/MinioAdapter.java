package com.italosantos.minha_mesa.infra.storage.adapter;

import com.italosantos.minha_mesa.exception.UploadMediaException;
import com.italosantos.minha_mesa.infra.storage.port.MediaStorage;
import io.minio.*;
import io.minio.errors.MinioException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

public class MinioAdapter implements MediaStorage {
    @Value("${minio.url}")
    private String minioUrl;

    @Value("${minio.bucket.name}")
    private String bucketName;

    @Value( "${minio.access.name}" )
    private String accessKey;

    @Value( "${minio.access.secret}" )
    private String accessSecret;

    private final MinioClient minioClient = MinioClient.builder()
                .endpoint(this.minioUrl)
                .credentials(accessKey, accessSecret)
                .build();

    @Override
    public void uploadMedia(MultipartFile file, String path) {
        try{
            boolean bucketExists = this.minioClient.bucketExists(BucketExistsArgs.builder().bucket(this.bucketName).build());
            if (!bucketExists)
                this.minioClient.makeBucket(MakeBucketArgs.builder().bucket(this.bucketName).build());
            this.minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(path)
                            .stream(file.getInputStream(), file.getSize(), -1L)
                            .contentType(file.getContentType())
                            .build()
            );
        }catch (MinioException |IOException exception){
            throw new UploadMediaException();
        }
    }

    @Override
    public String getAssignedUrl(String path) {
        try{
            return this.minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Http.Method.GET)
                            .bucket(bucketName)
                            .object(path)
                            .expiry(2, TimeUnit.HOURS)
                            .build()
            );
        }catch (MinioException e){
            throw new UploadMediaException();
        }
    }

    @Override
    public void deleteMedia(String path) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(path)
                            .build()
            );
        } catch (Exception e) {
            throw new UploadMediaException();
        }
    }
}
