package com.dac.BackEnd.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dac.BackEnd.constant.SuccessConstants;
import com.dac.BackEnd.convertor.BlogConvertor;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.response.PagedResponse;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponseBody;
import com.dac.BackEnd.model.response.ResponsesBody;
import com.dac.BackEnd.service.BlogService;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("api/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @GetMapping()
    public ResponseEntity<?> getAllBlogGuest(@RequestParam(required = false, defaultValue = "1") int page,
                                                @RequestParam(required = false, defaultValue = "") String searchText) {
        try {
            ResponsesBody responseBody = new ResponsesBody();
            responseBody.setCode(SuccessConstants.OK_CODE);
            responseBody.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE));
            PagedResponse<Blog> pagedResponse = blogService.getAllBlogsGuest(searchText, page);
            responseBody.setData(BlogConvertor.convertToObjects(pagedResponse.getContent()));
            responseBody.setPageInfo(pagedResponse.getResponsePage());
            return ResponseEntity.ok().body(responseBody);
        } catch (MessageException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e));
        }
    }

    @GetMapping("{blogId}")
    public ResponseEntity<?> getBlogByIdGuest(@PathVariable Long blogId) {
        try {
            return ResponseEntity.ok().body(createSuccessResponse(blogService.getBlogByIdGuest(blogId)));
        } catch (MessageException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e));
        }
    }

    @GetMapping("film/{filmId}")
    public ResponseEntity<?> getBlogsByFilm(@PathVariable Long filmId, @RequestParam(required = false, defaultValue = "1") int page) {
        try {
            ResponsesBody responseBody = new ResponsesBody();
            responseBody.setCode(SuccessConstants.OK_CODE);
            responseBody.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE));
            PagedResponse<Blog> pagedResponse = blogService.getAllBlogsByFilmGuest(filmId, page);
            responseBody.setData(BlogConvertor.convertToObjects(pagedResponse.getContent()));
            responseBody.setPageInfo(pagedResponse.getResponsePage());
            return ResponseEntity.ok().body(responseBody);
        } catch (MessageException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e));
        }
    }
    

    private ResponseBody createSuccessResponse(Object data) {
        ResponseBody responseBody = new ResponseBody();
        responseBody.setCode(SuccessConstants.OK_CODE);
        responseBody.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE, SuccessConstants.OK_CODE));
        responseBody.setData(data);
        return responseBody;
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
