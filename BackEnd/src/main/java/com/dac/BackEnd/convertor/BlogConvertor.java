package com.dac.BackEnd.convertor;

import java.util.List;
import java.util.ArrayList;

import com.dac.BackEnd.entity.ContentEntity;
import com.dac.BackEnd.entity.BlogEntity.BlogEntity;
import com.dac.BackEnd.model.Blog;

public class BlogConvertor {
    
    public static Blog toModel(BlogEntity entity) {
        Blog blog = new Blog();
        blog.setId(entity.getId());
        blog.setFilmId(entity.getFilm().getId());
        blog.setTitle(entity.getTitle());
        blog.setImage(entity.getImage());
        blog.setPoint(entity.getPoint());
        blog.setPostTime(entity.getPostTime());
        blog.setStatus(entity.getStatus());
        blog.setInsertDateTime(entity.getInsertDateTime());
        blog.setInsertByReviewerId(entity.getInsertBy().getId());
        blog.setUpdateDateTime(entity.getUpdateDateTime());
        blog.setUpdateByReviewerId(entity.getUpdateBy().getId());
        blog.setDeleteFlag(entity.getDeleteFlag());
        blog.setContentId(entity.getContents().stream().map(ContentEntity::getId).toList());
        return blog;
    }

    public static List<Object> convertToObjects(List<Blog> blogs) {
        List<Object> objects = new ArrayList<>();
        for (Blog blog : blogs) {
            objects.add(blog);
        }
        return objects;
    }
}
