package com.dac.BackEnd.model.request;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BlogInput {

    @NotNull
    private Long filmId;

    @NotBlank
    @Size(max = 255)
    private String title;

    private MultipartFile blogImage;

    private MultipartFile blogImageIntroduce;

    @NotBlank
    @Size(max = 700)
    private String summary;

    @NotNull
    private double point;

    private List<ContentInput> contents;
}
