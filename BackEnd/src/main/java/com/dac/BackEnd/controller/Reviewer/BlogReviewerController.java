package com.dac.BackEnd.controller.Reviewer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.constant.SuccessConstants;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.request.BlogInput;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponseBody;
import com.dac.BackEnd.service.BlogService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("api/reviewer/blogs")
public class BlogReviewerController {
    
    @Autowired
    private BlogService blogService;

    @PostMapping()
    public ResponseEntity<?> createNewBlog(@Valid @RequestBody BlogInput blogInput) {
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

    
    
    
}
