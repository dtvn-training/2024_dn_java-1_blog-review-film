package com.dac.BackEnd.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentInput {

    private String imageUrl;

    @NotBlank
    @Size(min = 1)
    private String content;
}
