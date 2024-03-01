package com.dac.BackEnd.controller.Admin;

import org.springframework.web.bind.annotation.*;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.constant.SuccessConstants;
import com.dac.BackEnd.convertor.UserConvertor;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.request.ReviewerInput;
import com.dac.BackEnd.model.request.ReviewerUpdateInput;
import com.dac.BackEnd.model.request.StatusRequest;
import com.dac.BackEnd.model.User;
import com.dac.BackEnd.model.request.DeleteRequest;
import com.dac.BackEnd.model.response.PagedResponse;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponseBody;
import com.dac.BackEnd.model.response.ResponsesBody;
import com.dac.BackEnd.service.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("api/admin/reviewers")
public class UserAdminController {

    @Autowired
    private UserService userService;

    @GetMapping()
    public ResponseEntity<?> getAllReviewer(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "") String searchText) {
        try {
            ResponsesBody body = new ResponsesBody();
            body.setCode(SuccessConstants.OK_CODE);
            body.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE));
            PagedResponse<User> pagedResponse = userService.getAllUser(page, status, searchText);
            body.setData(UserConvertor.convertToObjects(pagedResponse.getContent()));
            body.setPageInfo(pagedResponse.getResponsePage());
            return ResponseEntity.ok().body(body);
        } catch (MessageException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e));
        }
    }

    @PostMapping()
    public ResponseEntity<?> createNewReviewer(@Valid @RequestBody ReviewerInput input) {
        try {
            ResponseBody response = new ResponseBody();
            response.setCode(SuccessConstants.CREATED_CODE);
            response.setMessage(Arrays.asList(new MessageException(SuccessConstants.CREATED_MESSAGE), SuccessConstants.CREATED_CODE));
            response.setData(userService.createNewReviewer(input));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (MessageException e) {
            return ResponseEntity.status(e.getErrorCode()).body(createErrorResponse(e));
        }
    }

    @PutMapping("{reviewerId}")
    public ResponseEntity<?> updateReviewer(@Valid @RequestBody ReviewerUpdateInput input, @PathVariable Long reviewerId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(createSuccessResponse(userService.updateReviewer(input, reviewerId)));
        } catch (MessageException e) {
            return ResponseEntity.status(e.getErrorCode()).body(createErrorResponse(e));
        }
    }

    @PatchMapping()
    public ResponseEntity<Response> updateStatusUser(@RequestBody StatusRequest status) {
        try {
            userService.updateStatusReviewer(status);
            return ResponseEntity.status(HttpStatus.OK).body(createSuccessResponse());
        } catch (MessageException e) {
            return ResponseEntity.status(e.getErrorCode()).body(createErrorResponse(e));
        }
    }

    @DeleteMapping("{reviewerId}")
    public ResponseEntity<Response> deleteReviewer(@PathVariable Long reviewerId) {
        try {
            userService.deleteUser(reviewerId);
            return ResponseEntity.status(HttpStatus.OK).body(createSuccessResponse());
        } catch (MessageException e) {
            return ResponseEntity.status(e.getErrorCode()).body(createErrorResponse(e));
        }
    }

    @DeleteMapping()
    public ResponseEntity<Response> deleteReviewers(@RequestBody DeleteRequest deletes) {
        try {
            userService.deleteUsers(deletes);
            return ResponseEntity.status(HttpStatus.OK).body(createSuccessResponse());
        } catch (MessageException e) {
            return ResponseEntity.status(e.getErrorCode()).body(createErrorResponse(e));
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Response handleValidationExceptions(MethodArgumentNotValidException ex) {
        Response response = new Response();
        response.setCode(ErrorConstants.INVALID_DATA_CODE);
        List<Object> messages = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
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
