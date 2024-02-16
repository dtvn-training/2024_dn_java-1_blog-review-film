package com.dac.BackEnd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dac.BackEnd.convertor.UserConvertor;
import com.dac.BackEnd.model.User;
import com.dac.BackEnd.model.request.LoginInput;
import com.dac.BackEnd.model.response.LoginResponse;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.security.jwt.JwtProvider;
import com.dac.BackEnd.security.userprincal.CustomUserDetailService;
import com.dac.BackEnd.security.userprincal.UserPrinciple;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailService customUserDetailService;

    @Autowired
    JwtProvider jwtProvider;

    @PostMapping("login")
    public LoginResponse login(@Valid @RequestBody LoginInput loginInput) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(loginInput.getEmail(), loginInput.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = customUserDetailService.loadUserByUsername(loginInput.getEmail());
        String token = jwtProvider.createToken(userDetails);
        UserPrinciple userPrinciple = (UserPrinciple) userDetails;
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setCode(200);
        loginResponse.setMessage(null);
        loginResponse.setToken(token);
        loginResponse.setData(UserConvertor.userPrincipleToModel(userPrinciple));
        return loginResponse;
    }

    
}
