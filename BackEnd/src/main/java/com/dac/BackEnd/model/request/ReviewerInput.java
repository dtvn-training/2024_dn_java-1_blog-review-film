package com.dac.BackEnd.model.request;

import org.hibernate.annotations.NaturalId;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewerInput {

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
    @Size(min = 6, max = 50, message = "Password length must be between 6 and 50 characters.")
    private String password;

    @NotBlank
    @Size(min = 3, max = 30)
    private String name;

    @Size(min = 10, max = 10, message = "Phone number must be exactly 10 characters")
    @Pattern(regexp = "^(\\+\\d{1,3}[- ]?)?\\d{10}$", message = "Invalid phone number")
    private String phone;
}
