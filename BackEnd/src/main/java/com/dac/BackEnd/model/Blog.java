package com.dac.BackEnd.model;

import java.time.LocalDateTime;


import com.dac.BackEnd.entity.BlogEntity.BlogStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Blog {

    @NotNull
    private Long id;

    @NotNull
    private Film film;

    @NotBlank
    @Size(max = 255)
    private String title;

    private String summary;

    private String image;

    private String imageIntroduce;

    @NotNull
    private double point;

    private LocalDateTime postTime;

    @NotBlank
    private BlogStatus status;

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

    @NotNull
    private List<Content> contents;
}
