package com.dac.BackEnd.model.request;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusRequest {
    private List<Long> ids;
    private String status;
}
