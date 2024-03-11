package com.dac.BackEnd.service.impl;


import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.model.PutObjectResult;
import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.constant.TypeImageConstants;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.service.AmazonS3Service;
import com.dac.BackEnd.service.ImageService;

@Service
public class ImageServiceImpl implements ImageService{
    @Autowired
    private AmazonS3Service amazonS3Service;

    @Value("${aws.s3.bucket.name}")
    private String bucketName;

    @Value("${endpoint.url}")
    private String endPoint;

    @Override
    public String upload(MultipartFile file, String type) {
        String imageFor = "";
        String url = endPoint;
         try {
            if (file.isEmpty()) {
                throw new IOException("Cannot upload empty file");
            }
            switch (type) {
                case TypeImageConstants.BLOG_IMAGE:
                    imageFor = TypeImageConstants.BLOG_IMAGE;
                    break;
                case TypeImageConstants.FILM_IMAGE:
                    imageFor = TypeImageConstants.FILM_IMAGE;
                    break;
                case TypeImageConstants.CONTENT_IMAGE:
                    imageFor = TypeImageConstants.CONTENT_IMAGE;
                    break;
                default:
                    throw new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
            }

            Map<String, String> metadata = new HashMap<>();
            metadata.put("Content-Type", file.getContentType());
            metadata.put("Content-Length", String.valueOf(file.getSize()));
            String path = String.format("%s/%s", bucketName, imageFor);
            String fileName = generateFileName(file);
            // Uploading file to s3
            PutObjectResult putObjectResult = amazonS3Service.upload(
                    path, fileName, Optional.of(metadata), file.getInputStream());
            return url + imageFor + "/" + fileName;
         } catch (Exception e) {
            throw new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
         }
    }

    private String generateFileName(MultipartFile multiPart) {
        return new Date().getTime() + "-" + multiPart.getOriginalFilename().replace(" ", "_");
    } 
}
