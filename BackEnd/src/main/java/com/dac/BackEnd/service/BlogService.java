package com.dac.BackEnd.service;

import java.util.List;

import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.response.ResponsePage;

public interface BlogService {

    ResponsePage getPageInfo(int page);

    List<Blog> getAllBlogs(int page);

    
    
}
