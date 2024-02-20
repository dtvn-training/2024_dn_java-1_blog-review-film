package com.dac.BackEnd.controller.Admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;

import com.dac.BackEnd.convertor.BlogConvertor;
import com.dac.BackEnd.entity.BlogEntity.BlogStatus;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.request.BlogStatusRequest;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponseBody;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.model.response.ResponsesBody;
import com.dac.BackEnd.service.BlogService;
import com.dac.BackEnd.validation.BlogStatusValidation;

import jakarta.transaction.Transactional;



@RestController
@RequestMapping("api/admin/blogs")
public class BlogsAdminController {

    @Autowired
    private BlogService blogService;
    
    @GetMapping()
    public ResponseEntity<?> getAllBlogs(@RequestParam(required = false, defaultValue = "1") int page) {
        try {
            ResponsePage responsePage = blogService.getPageInfo(page);
            ResponsesBody body = new ResponsesBody();
            body.setCode(200);
            body.setData(BlogConvertor.convertToObjects(blogService.getAllBlogs(page)));
            body.setPageInfo(responsePage);
            body.setMessage(Arrays.asList("Success"));
            return ResponseEntity.ok().body(body);
        } catch (Exception e) {
            Response body = new Response();
            body.setCode(404);
            body.setMessage(Arrays.asList(new MessageException(e.getMessage(), 404)));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
    }

    @GetMapping("{blogId}")
    public ResponseEntity<?> getBlogsById(@PathVariable Long blogId) {
        try {
            Blog blog = blogService.getBlogById(blogId);
            ResponseBody body = new ResponseBody();
            body.setCode(200);
            body.setData(blog);
            body.setMessage(Arrays.asList("Success"));
            return ResponseEntity.ok().body(body);
        } catch (Exception e) {
            Response body = new Response();
            body.setCode(404);
            body.setMessage(Arrays.asList(new MessageException(e.getMessage(), 404)));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
    }

    @Transactional
    @PatchMapping("{blogId}")
    public ResponseEntity<?> updateBlogStatus(@PathVariable Long blogId, @RequestBody BlogStatusRequest blogStatus) {
        try {
            Response response = new Response();
            blogService.updateStatusBlog(blogId, blogStatus.getStatus());
            response.setCode(200);
            response.setMessage(Arrays.asList("Success", 200));
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            Response response = new Response();
            response.setCode(404);
            response.setMessage(Arrays.asList(new MessageException(e.getMessage(), 404)));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

}
