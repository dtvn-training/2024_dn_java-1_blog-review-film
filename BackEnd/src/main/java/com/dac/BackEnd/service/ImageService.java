package com.dac.BackEnd.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    public String upload(MultipartFile file, String type);
}
