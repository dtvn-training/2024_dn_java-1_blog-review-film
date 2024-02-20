package com.dac.BackEnd.model.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Response {
    private int code;
    private List<Object> message;
}
