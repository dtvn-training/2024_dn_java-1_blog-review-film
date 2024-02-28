package com.dac.BackEnd.model.request;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FilmInput {
    private Long categoryId;

    @NotBlank
    @Size(max = 50)
    private String nameFilm;

    private MultipartFile filmImage;

    @NotBlank
    @Size(max = 30)
    private String director;

    @NotBlank
    @Size(max = 5)
    private String country;

    @NotNull
    private LocalDate startDate;

    @NotBlank
    @Size(max = 255)
    private String description;

}
