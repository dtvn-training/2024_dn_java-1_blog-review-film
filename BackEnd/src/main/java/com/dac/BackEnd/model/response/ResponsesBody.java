package com.dac.BackEnd.model.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponsesBody {
    private Integer code;
    private List<Object> message;
    private ResponsePage pageInfo;
    private List<Object> data; 
}
