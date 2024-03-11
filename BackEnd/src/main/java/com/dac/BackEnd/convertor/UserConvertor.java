package com.dac.BackEnd.convertor;

import java.util.ArrayList;
import java.util.List;

import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.model.User;
import com.dac.BackEnd.security.userprincal.UserPrinciple;

public class UserConvertor {

    public static User toModel(UserEntity entity) {
        User user = new User();
        user.setId(entity.getId());
        user.setEmail(entity.getEmail());
        user.setRole(entity.getRole());
        user.setName(entity.getName());
        if (entity.getPhone() != null) {
            user.setPhone(entity.getPhone());
        }
        user.setStatus(entity.getStatus());
        user.setInsertDateTime(entity.getInsertDateTime());
        user.setInsertBy(entity.getInsertByUserId());
        user.setUpdateDateTime(entity.getUpdateDateTime());
        user.setUpdateBy(entity.getUpdateByUserId());
        user.setDeleteFlag(entity.getDeleteFlag());
        return user;
    }

    public static List<Object> convertToObjects(List<User> users) {
        List<Object> objects = new ArrayList<>();
        for (User user : users) {
            objects.add(user);
        }
        return objects;
    }

    public static Object convertToObject(User user) {
        return user;
    }

    public static User userPrincipleToModel(UserPrinciple principle) {
        User user = new User();
        user.setId(principle.getId());
        user.setEmail(principle.getEmail());
        user.setRole(principle.getRole());
        user.setName(principle.getName());
        if (principle.getPhone() != null) {
            user.setPhone(principle.getPhone());
        }
        user.setStatus(principle.getStatus());
        return user;
    }
}
