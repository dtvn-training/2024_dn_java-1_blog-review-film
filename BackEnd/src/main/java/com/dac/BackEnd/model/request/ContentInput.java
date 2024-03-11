package com.dac.BackEnd.model.request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentInput {

    private Long id;

    private MultipartFile imageContent;

    @NotBlank
    @Size(min = 1)
    private String content;
}
