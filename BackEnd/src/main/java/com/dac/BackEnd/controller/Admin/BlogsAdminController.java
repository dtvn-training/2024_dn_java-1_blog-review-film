package com.dac.BackEnd.controller.Admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

import com.dac.BackEnd.constant.SuccessConstants;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.request.DeleteRequest;
import com.dac.BackEnd.model.request.StatusRequest;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponseBody;
import com.dac.BackEnd.service.BlogService;

import jakarta.transaction.Transactional;




@RestController
@RequestMapping("api/admin/blogs")
public class BlogsAdminController {

    @Autowired
    private BlogService blogService;

    @Transactional
    @PatchMapping()
    public ResponseEntity<Response> updateBlogStatus(@RequestBody StatusRequest blogStatus) {
        try {
            blogService.updateStatusBlog(blogStatus);
            return ResponseEntity.ok().body(createSuccessResponse());
        } catch (MessageException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e));
        }
    }

    private Response createSuccessResponse() {
        Response response = new Response();
        response.setCode(SuccessConstants.OK_CODE);
        response.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE, SuccessConstants.OK_CODE));
        return response;
    }

    private Response createErrorResponse(MessageException e) {
        Response response = new Response();
        response.setCode(e.getErrorCode());
        response.setMessage(Arrays.asList(e));
        return response;
    }
}

