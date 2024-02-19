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
    private Long filmId;

    @NotBlank
    @Size(max = 255)
    private String title;

    private String image;

    @NotNull
    private double point;

    @NotNull
    private LocalDateTime postTime;

    @NotBlank
    private BlogStatus status;

    @NotNull
    private LocalDateTime insertDateTime;

    @NotNull
    private Long insertByReviewerId;

    @NotNull
    private LocalDateTime updateDateTime;

    @NotNull
    private Long updateByReviewerId;

    @NotNull
    private Boolean deleteFlag;

    @NotNull
    private List<Long> contentId;
}
