package com.dac.BackEnd.controller;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dac.BackEnd.convertor.UserConvertor;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.request.LoginInput;
import com.dac.BackEnd.model.response.LoginResponse;
import com.dac.BackEnd.model.response.ResponseBody;
import com.dac.BackEnd.security.jwt.JwtProvider;
import com.dac.BackEnd.security.userprincal.CustomAuthenticationProvider;
import com.dac.BackEnd.security.userprincal.UserPrinciple;

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

    @PostMapping("login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginInput loginInput) {
        try {
            Authentication authentication = customAuthenticationProvider.authenticate( new UsernamePasswordAuthenticationToken(loginInput.getEmail(), loginInput.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtProvider.createToken(authentication);
            UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setCode(200);
            loginResponse.setMessage(Arrays.asList("Login successful"));
            loginResponse.setToken(token);
            loginResponse.setData(UserConvertor.userPrincipleToModel(userPrinciple));
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        } catch (Exception e) {
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setCode(400);
            loginResponse.setMessage(Arrays.asList(new MessageException(e.getMessage(), 400)));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(loginResponse);
        }
    }
    
}
