package com.dac.BackEnd.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.convertor.BlogConvertor;
import com.dac.BackEnd.entity.BlogEntity.BlogEntity;
import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.repository.BlogRepository;
import com.dac.BackEnd.service.BlogService;

@Service
public class BlogServiceImpl implements BlogService{

    @Autowired
    private BlogRepository blogRepository;

    @Override
    public ResponsePage getPageInfo(int page) {
        int totalBlogs = blogRepository.countAllBlogs();
        int totalPages = (int) Math.ceil((double) totalBlogs / 10);
        
        if (page < 1 || page > totalPages) {
            throw new IllegalArgumentException("Invalid page number");
        }
        ResponsePage responsePage = new ResponsePage();
        responsePage.setPage(page);
        responsePage.setPer_page(10);
        responsePage.setTotal(totalBlogs);
        responsePage.setTotal_pages(totalPages);
        return responsePage;
    }

    @Override
    public List<Blog> getAllBlogs(int page) {
        return blogRepository.findAllBlogsPerPage((page - 1)  * 10).stream().map(BlogConvertor::toModel).toList();
    }

}
