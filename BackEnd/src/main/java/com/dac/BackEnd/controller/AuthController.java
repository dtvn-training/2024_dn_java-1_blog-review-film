package com.dac.BackEnd.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.constant.SuccessConstants;
import com.dac.BackEnd.convertor.UserConvertor;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.request.LoginInput;
import com.dac.BackEnd.model.request.ReviewerInput;
import com.dac.BackEnd.model.response.LoginResponse;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponseBody;
import com.dac.BackEnd.security.jwt.JwtProvider;
import com.dac.BackEnd.security.userprincal.CustomAuthenticationProvider;
import com.dac.BackEnd.security.userprincal.UserPrinciple;
import com.dac.BackEnd.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private CustomAuthenticationProvider customAuthenticationProvider;

    @Autowired
    JwtProvider jwtProvider;

    @Autowired
    private UserService userService;

    @PostMapping("login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginInput loginInput) {
        try {
            Authentication authentication = customAuthenticationProvider.authenticate( new UsernamePasswordAuthenticationToken(loginInput.getEmail(), loginInput.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtProvider.createToken(authentication);
            UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setCode(SuccessConstants.OK_CODE);
            loginResponse.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE));
            loginResponse.setToken(token);
            loginResponse.setData(UserConvertor.userPrincipleToModel(userPrinciple));
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        } catch (MessageException e) {
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setCode(e.getErrorCode());
            loginResponse.setMessage(Arrays.asList(e));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() { 
        // Lấy đối tượng Authentication từ SecurityContextHolder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {
            // Xóa session hiện tại và đăng xuất người dùng
            SecurityContextHolder.clearContext();
        }
        ResponseBody response = new ResponseBody(); 
        response.setCode(SuccessConstants.OK_CODE);
        response.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE));
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("register")
    public ResponseEntity<?> registerReviewer(@Valid @RequestBody ReviewerInput input) {
        try {
            ResponseBody response = new ResponseBody();
            response.setCode(SuccessConstants.CREATED_CODE);
            response.setMessage(Arrays.asList(new MessageException(SuccessConstants.CREATED_MESSAGE), SuccessConstants.CREATED_CODE));
            response.setData(userService.createNewReviewer(input));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (MessageException e) {
            Response response = new Response();
            response.setCode(e.getErrorCode());
            response.setMessage(Arrays.asList(e));
            return ResponseEntity.status(e.getErrorCode()).body(response);
        }
    }
    

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Response handleValidationExceptions(MethodArgumentNotValidException ex){
        Response response = new Response();
        response.setCode(ErrorConstants.INVALID_CREDENTIALS_CODE);
        List<Object> messages = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach((error)->{
            String fieldName = ((FieldError) error).getField();
            messages.add(new MessageException(fieldName + ": " + error.getDefaultMessage(), response.getCode()));
        });
        response.setMessage(messages);
        return response;
    }


    
}
