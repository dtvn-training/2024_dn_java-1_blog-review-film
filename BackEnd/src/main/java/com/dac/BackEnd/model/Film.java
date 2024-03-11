package com.dac.BackEnd.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class Film {

    private Long id;

    @NotNull
    private Category category;

    @NotBlank
    @Size(max = 255)
    private String nameFilm;

    private String image;

    @NotBlank
    @Size(max = 255)
    private String director;

    @NotBlank
    @Size(max = 255)
    private String country;

    @NotNull
    private LocalDate startDate;

    @NotBlank
    private String description;

    @NotNull
    private LocalDateTime insertDateTime;

    @NotNull
    private User insertBy;

    @NotNull
    private LocalDateTime updateDateTime;

    @NotNull
    private User updateBy;

    @NotNull
    private Boolean deleteFlag;
}
