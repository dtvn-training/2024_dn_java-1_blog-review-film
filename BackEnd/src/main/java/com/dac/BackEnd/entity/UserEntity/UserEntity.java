package com.dac.BackEnd.entity.UserEntity;

import java.time.LocalDateTime;

import org.hibernate.annotations.NaturalId;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "email"
        })
})
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NaturalId
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Pattern(regexp = "(?=.*[0-9]).+", message = "Password must contain at least one digit.")
    @Pattern(regexp = "(?=.*[a-z]).+", message = "Password must contain at least one lowercase letter.")
    @Pattern(regexp = "(?=.*[A-Z]).+", message = "Password must contain at least one uppercase letter.")
    @Pattern(regexp = "(?=.*[@#$%^&+=]).+", message = "Password must contain at least one special character.")
    @Size(min = 6, max = 255, message = "Password length must be between 6 and 50 characters.")
    private String password;

    @NotNull
    private UserRole role;

    @NotBlank
    @Size(min = 3, max = 30)
    private String name;

    @Size(min = 10, max = 10, message = "Phone number must be exactly 10 characters")
    @Pattern(regexp = "^(\\+\\d{1,3}[- ]?)?\\d{10}$", message = "Invalid phone number")
    private String phone;

    @NotNull
    private UserStatus status;

    @NotNull
    private LocalDateTime insertDateTime;

    private Long insertByUserId;

    @NotNull
    private LocalDateTime updateDateTime;

    private Long updateByUserId;

    @NotNull
    private Boolean deleteFlag;
    
}
