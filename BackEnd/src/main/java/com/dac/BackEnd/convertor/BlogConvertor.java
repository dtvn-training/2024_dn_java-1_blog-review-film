package com.dac.BackEnd.convertor;

import java.util.List;
import java.util.ArrayList;

import com.dac.BackEnd.entity.BlogEntity.BlogEntity;
import com.dac.BackEnd.model.Blog;

public class BlogConvertor {
    
    public static Blog toModel(BlogEntity entity) {
        Blog blog = new Blog();
        blog.setId(entity.getId());
        blog.setFilm(FilmConvertor.toModel(entity.getFilm()));
        blog.setTitle(entity.getTitle());
        blog.setSummary(entity.getSummary());
        blog.setImage(entity.getImage());
        blog.setPoint(entity.getPoint());
        blog.setPostTime(entity.getPostTime());
        blog.setImage(entity.getImage());
        blog.setImageIntroduce(entity.getImageIntroduce());
        blog.setStatus(entity.getStatus());
        blog.setInsertDateTime(entity.getInsertDateTime());
        blog.setInsertBy(UserConvertor.toModel(entity.getInsertBy()));
        blog.setUpdateDateTime(entity.getUpdateDateTime());
        blog.setUpdateBy(UserConvertor.toModel(entity.getUpdateBy()));
        blog.setDeleteFlag(entity.getDeleteFlag());
        blog.setContents(entity.getContents().stream().map(ContentConvertor::toModel).toList());
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
