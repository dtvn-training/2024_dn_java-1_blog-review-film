package com.dac.BackEnd.model;

import java.time.LocalDateTime;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Content {

    @NotNull
    private Long id;

    private String imageUrl;

    @NotBlank
    @Lob
    private String content;

    @NotNull
    private LocalDateTime insertDateTime;

    @NotNull
    private User insertBy;

    @NotNull
    private LocalDateTime updateDateTime;

    @NotNull
    private User updateBy;
}
