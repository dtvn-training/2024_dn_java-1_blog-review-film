package com.dac.BackEnd.service;

import java.time.LocalDateTime;
import java.util.List;

import com.dac.BackEnd.entity.BlogEntity.BlogEntity;
import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.request.BlogInput;
import com.dac.BackEnd.model.response.ResponsePage;

public interface BlogService {

    ResponsePage getPageInfo(int page, String by, String status, String searchText, LocalDateTime startTime, LocalDateTime endTime);

    List<Blog> getAllBlogs(int page);

    List<Blog> getAllBlogsByStatus(String status, int page);

    List<Blog> getAllBlogByText(String searchText, int page);

    Blog getBlogById(Long blogId);

    void updateStatusBlog(Long blogId, String status);

    List<Blog> getAllBlogByPostTime(LocalDateTime startTime, LocalDateTime endTime, int page);

    Blog createNewBlog(BlogInput blogInput);

    

   

    
    
}
