package com.dac.BackEnd.entity;

import java.time.LocalDate;
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
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "films")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FilmEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

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
