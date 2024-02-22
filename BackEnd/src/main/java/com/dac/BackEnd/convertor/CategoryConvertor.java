package com.dac.BackEnd.convertor;

import java.util.ArrayList;
import java.util.List;

import com.dac.BackEnd.entity.CategoryEntity;
import com.dac.BackEnd.model.Category;

public class CategoryConvertor {

    public static Category toModel(CategoryEntity entity) {
        Category category = new Category();
        category.setId(entity.getId());
        category.setNameCategory(entity.getNameCategory());
        return category;
    }

    public static List<Object> convertToObjects(List<Category> categories) {
        List<Object> objects = new ArrayList<>();
        for (Category category : categories) {
            objects.add(category);
        }
        return objects;
    }
}
