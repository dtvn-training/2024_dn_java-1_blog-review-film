package com.dac.BackEnd.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.convertor.UserConvertor;
import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.model.User;
import com.dac.BackEnd.repository.UserRepository;
import com.dac.BackEnd.service.UserService;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAllUser(int page) {
        List<UserEntity> userEntities = userRepository.findAll();
        return userEntities.stream().map(UserConvertor::toModel).toList();
    }
    
}
