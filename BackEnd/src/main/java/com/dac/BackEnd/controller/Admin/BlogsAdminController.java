package com.dac.BackEnd.controller.Admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;

import com.dac.BackEnd.entity.BlogEntity.BlogStatus;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.response.ResponseBody;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.service.BlogService;
import com.dac.BackEnd.validation.BlogStatusValidation;


@RestController
@RequestMapping("api/admin/blogs")
public class BlogsAdminController {

    @Autowired
    private BlogService blogService;
    
    @GetMapping()
    public ResponseEntity<ResponseBody> getAllBlogs(@RequestParam(required = false, defaultValue = "1") int page) {
        try {
            ResponsePage responsePage = blogService.getPageInfo(page);
            ResponseBody body = new ResponseBody();
            body.setCode(200);
            body.setData(blogService.getAllBlogs(page));
            body.setPageInfo(responsePage);
            body.setMessage(Arrays.asList("Success"));
            return ResponseEntity.ok().body(body);
        } catch (Exception e) {
            ResponseBody body = new ResponseBody();
            body.setCode(404);
            body.setMessage(Arrays.asList(new MessageException(e.getMessage(), 404)));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
    }

    @GetMapping("filter")
    public ResponseEntity<ResponseBody> getAllBlogsByBlogStatus(@RequestParam(required = false, defaultValue = "1") int page, @RequestParam(required = false, defaultValue = "WAITING") String status) {
        try {
            BlogStatus blogStatus = BlogStatusValidation.checkValidStatus(status);
            ResponsePage responsePage = blogService.getPageInfoByStatus(page, blogStatus);
            ResponseBody body = new ResponseBody();

            body.setCode(200);
            body.setData(blogService.getAllBlogsByStatus(page, blogStatus));
            body.setMessage(Arrays.asList("Success"));
            body.setPageInfo(responsePage);

            return ResponseEntity.ok().body(body);
        } catch (Exception e) {
            ResponseBody body = new ResponseBody();
            body.setCode(404);
            body.setMessage(Arrays.asList(new MessageException(e.getMessage(), 404)));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
    }
}
