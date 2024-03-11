package com.dac.BackEnd.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.convertor.CategoryConvertor;
import com.dac.BackEnd.model.Category;
import com.dac.BackEnd.repository.CategoryRepository;
import com.dac.BackEnd.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService{

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategoryDeleteFalse() {
        return categoryRepository.findAllByDeleteFlagFalse().stream().map(CategoryConvertor::toModel).toList();
    }
    
}
