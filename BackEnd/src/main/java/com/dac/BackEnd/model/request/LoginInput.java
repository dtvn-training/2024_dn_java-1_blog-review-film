package com.dac.BackEnd.model.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginInput {
    private String email;
    private String password;
}
