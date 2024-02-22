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

import java.util.Arrays;
import java.time.LocalDateTime;

import com.dac.BackEnd.constant.SuccessConstants;
import com.dac.BackEnd.convertor.BlogConvertor;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.request.BlogStatusRequest;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponseBody;
import com.dac.BackEnd.model.response.ResponsesBody;
import com.dac.BackEnd.service.BlogService;

import jakarta.transaction.Transactional;




@RestController
@RequestMapping("api/admin/blogs")
public class BlogsAdminController {

    @Autowired
    private BlogService blogService;
    
    @GetMapping()
    public ResponseEntity<?> getAllBlogs(@RequestParam(required = false, defaultValue = "1") int page,
                                        @RequestParam(required = false) String status,
                                        @RequestParam(required = false) String searchText,
                                        @RequestParam(required = false) LocalDateTime startTime,
                                        @RequestParam(required = false) LocalDateTime endTime) {
        try {
            ResponsesBody body = new ResponsesBody();
            if (status != null) {
                // Nếu có status, gọi hàm getAllBlogByStatus
                body.setData(BlogConvertor.convertToObjects(blogService.getAllBlogsByStatus(status, page)));
                body.setPageInfo(blogService.getPageInfo(page, "status", status, searchText, startTime, endTime));
            } else if (searchText != null) {
                // Nếu có searchText, gọi hàm getAllBlogByText
                body.setData(BlogConvertor.convertToObjects(blogService.getAllBlogByText(searchText, page)));
                body.setPageInfo(blogService.getPageInfo(page, "searchText", status, searchText, startTime, endTime));
            } else if (startTime != null && endTime != null) {
                // Nếu có startTime và endTime, gọi hàm getAllBlogByPostTime
                body.setData(BlogConvertor.convertToObjects(blogService.getAllBlogByPostTime(startTime, endTime, page)));
                body.setPageInfo(blogService.getPageInfo(page, "postTime", status, searchText, startTime, endTime));
            } else {
                // Mặc định, gọi hàm getAllBlog
                body.setData(BlogConvertor.convertToObjects(blogService.getAllBlogs(page)));
                body.setPageInfo(blogService.getPageInfo(page, "all", status, searchText, startTime, endTime));
            }
            
            body.setCode(SuccessConstants.OK_CODE);
            body.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE));
            return ResponseEntity.ok().body(body);
        } catch (MessageException e) {
            Response body = new Response();
            body.setCode(e.getErrorCode());
            body.setMessage(Arrays.asList(e));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
    }

    @GetMapping("{blogId}")
    public ResponseEntity<?> getBlogsById(@PathVariable Long blogId) {
        try {
            Blog blog = blogService.getBlogById(blogId);
            ResponseBody body = new ResponseBody();
            body.setCode(SuccessConstants.OK_CODE);
            body.setData(blog);
            body.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE, SuccessConstants.OK_CODE));
            return ResponseEntity.ok().body(body);
        } catch (MessageException e) {
            Response body = new Response();
            body.setCode(e.getErrorCode());
            body.setMessage(Arrays.asList(e));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
    }

    @Transactional
    @PatchMapping("{blogId}")
    public ResponseEntity<?> updateBlogStatus(@PathVariable Long blogId, @RequestBody BlogStatusRequest blogStatus) {
        try {
            Response response = new Response();
            blogService.updateStatusBlog(blogId, blogStatus.getStatus());
            response.setCode(SuccessConstants.OK_CODE);
            response.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE, SuccessConstants.OK_CODE));
            return ResponseEntity.ok().body(response);
        } catch (MessageException e) {
            Response body = new Response();
            body.setCode(e.getErrorCode());
            body.setMessage(Arrays.asList(e));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
    } 
}
