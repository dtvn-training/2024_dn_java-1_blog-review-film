package com.dac.BackEnd.model.request;

import java.util.List;

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

    @NotBlank
    @Size(max = 700)
    private String summary;

    private String image;

    @NotNull
    private double point;

    private List<ContentInput> contents;
}
