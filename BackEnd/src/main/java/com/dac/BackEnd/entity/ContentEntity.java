package com.dac.BackEnd.entity;

import java.time.LocalDateTime;

import com.dac.BackEnd.entity.BlogEntity.BlogEntity;
import com.dac.BackEnd.entity.UserEntity.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
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
@Table(name = "contents")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContentEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "blog_id")
    private BlogEntity blog;

    private String imageUrl;

    @NotBlank
    @Lob
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

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

}
