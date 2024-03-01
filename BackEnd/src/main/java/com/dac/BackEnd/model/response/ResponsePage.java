package com.dac.BackEnd.model.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponsePage {
    private int page;
    private int per_page;
    private long total;
    private int total_pages;

}
