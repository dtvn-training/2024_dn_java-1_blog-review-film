package com.dac.BackEnd.controller.Reviewer;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.constant.SuccessConstants;
import com.dac.BackEnd.convertor.BlogConvertor;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.request.BlogInput;
import com.dac.BackEnd.model.request.ContentInput;
import com.dac.BackEnd.model.request.ContentsInput;
import com.dac.BackEnd.model.request.DeleteRequest;
import com.dac.BackEnd.model.response.PagedResponse;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponseBody;
import com.dac.BackEnd.model.response.ResponsesBody;
import com.dac.BackEnd.service.BlogService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;




@RestController
@RequestMapping("api/reviewer/blogs")
public class BlogReviewerController {
    
    @Autowired
    private BlogService blogService;

    @GetMapping()
    public ResponseEntity<?> getAllBlogs(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "") String status,
            @RequestParam(required = false, defaultValue = "") String searchText,
            @RequestParam(required = false) LocalDateTime startTime,
            @RequestParam(required = false) LocalDateTime endTime) {
        try {
            ResponsesBody responseBody = new ResponsesBody();
            responseBody.setCode(SuccessConstants.OK_CODE);
            responseBody.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE));
            PagedResponse<Blog> pagedResponse = blogService.getAllBlogs(status, searchText, startTime, endTime, page);
            responseBody.setData(BlogConvertor.convertToObjects(pagedResponse.getContent()));
            responseBody.setPageInfo(pagedResponse.getResponsePage());
            return ResponseEntity.ok().body(responseBody);
        } catch (MessageException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e));
        }
    }

    @GetMapping("{blogId}")
    public ResponseEntity<?> getBlogsById(@PathVariable Long blogId) {
        try {
            return ResponseEntity.ok().body(createSuccessResponse(blogService.getBlogById(blogId)));
        } catch (MessageException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e));
        }
    }

    @PostMapping()
    public ResponseEntity<?> createNewBlog(@Valid BlogInput blogInput){
        try {
            ResponseBody response = new ResponseBody();
            response.setCode(SuccessConstants.CREATED_CODE);
            response.setMessage(Arrays.asList(new MessageException(SuccessConstants.CREATED_MESSAGE), SuccessConstants.CREATED_CODE));
            response.setData(blogService.createNewBlog(blogInput));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (MessageException e) {
            Response response = new Response();
            response.setCode(e.getErrorCode());
            response.setMessage(Arrays.asList(e));
            return ResponseEntity.status(e.getErrorCode()).body(response);
        }
    }

    @PutMapping("{blogId}")
    public ResponseEntity<?> updateBlog(@Valid @RequestBody BlogInput blogInput, @PathVariable Long blogId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(createSuccessResponse(blogService.updateBlog(blogInput, blogId)));
        } catch (MessageException e) {
            return ResponseEntity.status(e.getErrorCode()).body(createErrorResponse(e));
        }
    }

    @PatchMapping("{blogId}")
    public ResponseEntity<?> updateImageBlog(@RequestPart("file") MultipartFile file, @PathVariable Long blogId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(createSuccessResponse(blogService.updateImageBlog(file, blogId)));
        } catch (MessageException e) {
            return ResponseEntity.status(e.getErrorCode()).body(createErrorResponse(e));
        }
    }

    @PatchMapping("imageIntroduce/{blogId}")
    public ResponseEntity<?> updateImageIntroduceBlog(@RequestPart("file") MultipartFile file, @PathVariable Long blogId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(createSuccessResponse(blogService.updateImageIntroduceBlog(file, blogId)));
        } catch (MessageException e) {
            return ResponseEntity.status(e.getErrorCode()).body(createErrorResponse(e));
        }
    }

    @PutMapping("{blogId}/content")
    public ResponseEntity<?> updateContent(@Valid ContentsInput contentInputs, @PathVariable Long blogId) { 
        try {
            return ResponseEntity.status(HttpStatus.OK).body(createSuccessResponse(blogService.updateContent(contentInputs.getContents(), blogId)));
        } catch (MessageException e) {
            return ResponseEntity.status(e.getErrorCode()).body(createErrorResponse(e));
        }
    }

    @DeleteMapping("{blogId}")
    public ResponseEntity<Response> deleteBlog(@PathVariable Long blogId) {
        try {
            blogService.deleteBlog(blogId);
            return ResponseEntity.status(HttpStatus.OK).body(createSuccessResponse());
        } catch (MessageException e) {
            return ResponseEntity.status(e.getErrorCode()).body(createErrorResponse(e));
        }
    }

    @DeleteMapping()
    public ResponseEntity<Response> deleteBlogs(@RequestBody DeleteRequest deletes) {
        try {
            blogService.deleteBlogs(deletes);
            return ResponseEntity.status(HttpStatus.OK).body(createSuccessResponse());
        } catch (MessageException e) {
            return ResponseEntity.status(e.getErrorCode()).body(createErrorResponse(e));
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Response handleValidationExceptions(MethodArgumentNotValidException ex){
        Response response = new Response();
        response.setCode(ErrorConstants.INVALID_DATA_CODE);
        List<Object> messages = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach((error)->{
            String fieldName = ((FieldError) error).getField();
            messages.add(new MessageException(fieldName + ": " + error.getDefaultMessage(), response.getCode()));
        });
        response.setMessage(messages);
        return response;
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
