package com.dac.BackEnd.model.request;

import com.dac.BackEnd.entity.BlogEntity.BlogStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BlogStatusRequest {
    private String status;
}
