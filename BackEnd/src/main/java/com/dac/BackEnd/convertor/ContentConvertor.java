package com.dac.BackEnd.convertor;

import com.dac.BackEnd.entity.ContentEntity;
import com.dac.BackEnd.model.Content;

public class ContentConvertor {
    public static Content toModel(ContentEntity entity) {
        Content content = new Content();
        content.setId(entity.getId());
        content.setImageUrl(entity.getImageUrl());
        content.setContent(entity.getContent());
        content.setInsertBy(UserConvertor.toModel(entity.getInsertBy()));
        content.setInsertDateTime(entity.getInsertDateTime());
        content.setUpdateBy(UserConvertor.toModel(entity.getUpdateBy()));
        content.setUpdateDateTime(entity.getUpdateDateTime());
        return content;
    }
}
