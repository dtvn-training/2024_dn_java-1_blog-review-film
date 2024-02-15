package com.dac.BackEnd.entity;

import java.time.LocalDateTime;

import com.dac.BackEnd.entity.UserEntity.UserEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "categories")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nameCategory;

    @NotNull
    private LocalDateTime insertDateTime;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "insertBy_userId")
    private UserEntity insertBy;

    @NotNull
    private LocalDateTime updateDateTime;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "updateBy_userId")
    private UserEntity updateBy;

    @NotNull
    private Boolean deleteFlag;
}
