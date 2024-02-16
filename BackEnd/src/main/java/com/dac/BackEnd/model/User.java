package com.dac.BackEnd.model;

import java.time.LocalDateTime;

import com.dac.BackEnd.entity.UserEntity.UserRole;
import com.dac.BackEnd.entity.UserEntity.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User {
    private Long id;

    @Size(max = 50)
    @Email
    private String email;

    @JsonIgnore
    @Size(min = 6, max = 100)
    private String password;

    private UserRole role;

    @Size(min = 3, max = 20)
    private String name;

    @Size(min = 10, max = 10, message = "Phone number must be exactly 10 characters")
    @Pattern(regexp = "^(\\+\\d{1,3}[- ]?)?\\d{10}$", message = "Invalid phone number")
    private String phone;

    private UserStatus status;

    private LocalDateTime insertDateTime;

    private Long insertByUserId;

    private LocalDateTime updateDateTime;

    private Long updateByUserId;

    private Boolean deleteFlag;
}
