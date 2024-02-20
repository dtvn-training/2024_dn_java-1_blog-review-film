package com.dac.BackEnd.service;

import java.util.List;

import com.dac.BackEnd.entity.BlogEntity.BlogStatus;
import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.response.ResponsePage;

public interface BlogService {

    ResponsePage getPageInfo(int page);

    List<Blog> getAllBlogs(int page);

    ResponsePage getPageInfoByStatus(int page, BlogStatus status);

    List<Blog> getAllBlogsByStatus(int page, BlogStatus status);

    Blog getBlogById(Long blogId);

    void updateStatusBlog(Long blogId, String status);
    
}
