package com.dac.BackEnd.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.dac.BackEnd.entity.UserEntity.UserEntity;

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
    private Long categoryId;

    @NotBlank
    @Size(max = 255)
    private String nameFilm;

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
    private Long insertByReviewerId;

    @NotNull
    private LocalDateTime updateDateTime;

    @NotNull
    private long updateByReviewerId;

    @NotNull
    private Boolean deleteFlag;
}
