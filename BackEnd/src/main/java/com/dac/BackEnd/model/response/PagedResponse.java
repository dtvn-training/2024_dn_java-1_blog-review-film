package com.dac.BackEnd.model.response;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PagedResponse<T>  implements Serializable{
    private static final long serialVersionUID = 1L;
    private List<T> content;
    private ResponsePage responsePage;
}
