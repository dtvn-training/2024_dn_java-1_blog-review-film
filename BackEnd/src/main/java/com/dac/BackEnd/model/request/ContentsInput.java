package com.dac.BackEnd.model.request;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentsInput {
    private List<ContentInput> contents;
}
