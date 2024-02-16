package com.dac.BackEnd.service;

import java.util.List;

import com.dac.BackEnd.model.User;

public interface UserService {

    List<User> getAllUser(int page);
    
}
