package com.dac.BackEnd.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.convertor.BlogConvertor;
import com.dac.BackEnd.entity.BlogEntity.BlogEntity;
import com.dac.BackEnd.entity.BlogEntity.BlogStatus;
import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.repository.BlogRepository;
import com.dac.BackEnd.service.BlogService;
import com.dac.BackEnd.validation.BlogStatusValidation;


@Service
public class BlogServiceImpl implements BlogService{

    @Autowired
    private BlogRepository blogRepository;

    @Override
    public ResponsePage getPageInfo(int page, String by, String status, String searchText, LocalDateTime startTime, LocalDateTime endTime) {
        int totalBlogs = 0;
        int totalPages = 0;
        int perPage = 10;
        switch (by) {
            case "status":
                if (status != null) {
                    totalBlogs = blogRepository.countAllBlogsByStatus(BlogStatusValidation.checkValidStatus(status));
                }
                break;
            case "searchText":
                if (searchText != null) {
                    totalBlogs = blogRepository.countAllBlogsByText(searchText);
                }
                break;
            case "postTime":
                if (startTime != null && endTime != null) {
                    totalBlogs = blogRepository.countAllBlogsByPostTime(startTime, endTime);
                }
                break;
            default:
                totalBlogs = blogRepository.countAllBlogs();
                break;
        }
        totalPages = (int) Math.ceil((double) totalBlogs / perPage);

        if (page < 1 || page > totalPages) {
            throw new IllegalArgumentException("Invalid page number");
        }

        ResponsePage responsePage = new ResponsePage();
        responsePage.setPage(page);
        responsePage.setPer_page(perPage);
        responsePage.setTotal(totalBlogs);
        responsePage.setTotal_pages(totalPages);
        return responsePage;
    }

    @Override
    public List<Blog> getAllBlogs(int page) {
        Pageable pageable = PageRequest.of(page - 1, 10);
        return blogRepository.findAllByOrderByInsertDateTimeDesc(pageable).stream().map(BlogConvertor::toModel).toList();
    }

    @Override
    public List<Blog> getAllBlogsByStatus(String status, int page) {
        Pageable pageable = PageRequest.of(page - 1, 10);
        BlogStatus blogStatus = BlogStatusValidation.checkValidStatus(status);
        return blogRepository.findAllByStatusOrderByInsertDateTimeDesc(blogStatus, pageable).stream().map(BlogConvertor::toModel).toList();
    }

    @Override
    public List<Blog> getAllBlogByText(String searchText, int page) {
        Pageable pageable = PageRequest.of(page - 1, 10);
        return blogRepository.findAllBySearchText(searchText, pageable).stream().map(BlogConvertor::toModel).toList();
    }

    @Override
    public List<Blog> getAllBlogByPostTime(LocalDateTime startTime, LocalDateTime endTime, int page) {
        Pageable pageable = PageRequest.of(page - 1, 10);
        return blogRepository.findAllByPostTimeBetween(startTime, endTime, pageable).stream().map(BlogConvertor::toModel).toList();
    }

    @Override
    public Blog getBlogById(Long blogId) {
        return BlogConvertor.toModel(blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found with ID: " + blogId)));
    }

    @Override
    public void updateStatusBlog(Long blogId, String status) {
        BlogStatus blogStatus = BlogStatusValidation.checkValidStatus(status);
        BlogEntity blogEntity = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found with ID: " + blogId));
        blogEntity.setStatus(blogStatus);
        blogRepository.save(blogEntity);
    }

    

    

    

    

}
