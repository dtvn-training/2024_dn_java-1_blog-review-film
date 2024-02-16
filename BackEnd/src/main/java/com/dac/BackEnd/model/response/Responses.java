package com.dac.BackEnd.model.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Responses {
    private Integer code;
    private List<Object> message;
    // private ResponsePage pageInfo;
    private int page;
    private int per_page;
    private int total;
    private int total_pages;
    private List<Object> data; 
}
