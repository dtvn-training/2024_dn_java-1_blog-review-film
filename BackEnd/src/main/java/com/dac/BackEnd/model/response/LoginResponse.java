package com.dac.BackEnd.model.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private Integer code;
    private List<Object> message;
    private String token;
    private Object data;
}
