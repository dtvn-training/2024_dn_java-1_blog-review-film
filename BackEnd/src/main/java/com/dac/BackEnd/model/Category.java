package com.dac.BackEnd.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Category {
    private Long id;
    private String nameCategory;
    private LocalDateTime insertDateTime;
    private Long insertByUserId;
    private LocalDateTime updateDateTime;
    private Long updateByUserId;
    private Boolean deleteFlag;
}
