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
import com.dac.BackEnd.model.response.PagedResponse;

public interface BlogService {

    PagedResponse<Blog> getAllBlogs(String status, String searchText, LocalDateTime startTime, LocalDateTime endTime, int page);   

    Blog getBlogById(Long blogId);

    void updateStatusBlog(StatusRequest status);

    Blog createNewBlog(BlogInput blogInput);

    void deleteBlog(Long blogId);

    Blog updateBlog(BlogInput blogInput, Long blogId);

    List<Content> updateContent(List<ContentInput> contentInputs, Long blogId);

    Object updateImageBlog(MultipartFile file, Long blogId);

    void deleteBlogs(DeleteRequest deletes);

    Blog getBlogByIdGuest(Long blogId);

    PagedResponse<Blog> getAllBlogsGuest(String searchText, int page);

    PagedResponse<Blog> getAllBlogsByFilmGuest(Long filmId, int page);

    Blog updateImageIntroduceBlog(MultipartFile file, Long blogId);
}
