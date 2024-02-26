package com.dac.BackEnd.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    public String upload(MultipartFile file, String type);
}
