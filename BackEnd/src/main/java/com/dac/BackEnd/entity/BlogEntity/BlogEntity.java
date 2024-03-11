package com.dac.BackEnd.entity.BlogEntity;

import java.time.LocalDateTime;

import com.dac.BackEnd.entity.FilmEntity;
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
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "blogs")
public class BlogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "reviewerId")
    private UserEntity reviewer;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "filmId")
    private FilmEntity film;

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
