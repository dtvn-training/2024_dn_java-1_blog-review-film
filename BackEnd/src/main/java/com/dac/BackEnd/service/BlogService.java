package com.dac.BackEnd.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.Content;
import com.dac.BackEnd.model.request.BlogInput;
import com.dac.BackEnd.model.request.ContentInput;
import com.dac.BackEnd.model.request.DeleteRequest;
import com.dac.BackEnd.model.request.StatusRequest;
import com.dac.BackEnd.model.response.ResponsePage;

public interface BlogService {

    ResponsePage getPageInfo(int page, String by, String status, String searchText, LocalDateTime startTime, LocalDateTime endTime);

    List<Blog> getAllBlogs(int page);

    List<Blog> getAllBlogsByStatus(String status, int page);

    List<Blog> getAllBlogByText(String searchText, int page);

    Blog getBlogById(Long blogId);

    void updateStatusBlog(StatusRequest status);

    List<Blog> getAllBlogByPostTime(LocalDateTime startTime, LocalDateTime endTime, int page);

    Blog createNewBlog(BlogInput blogInput);

    void deleteBlog(Long blogId);

    Blog updateBlog(BlogInput blogInput, Long blogId);

    List<Content> updateContent(List<ContentInput> contentInputs, Long blogId);

    Object updateImageBlog(MultipartFile file, Long blogId);

    Object updateImageContent(List<ContentInput> contents, Long blogId);

    void deleteBlogs(DeleteRequest deletes);

    

   

    
    
}
