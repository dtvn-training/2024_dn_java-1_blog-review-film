package com.dac.BackEnd.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.convertor.UserConvertor;
import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.entity.UserEntity.UserStatus;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.User;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.repository.UserRepository;
import com.dac.BackEnd.service.UserService;
import com.dac.BackEnd.validation.BlogStatusValidation;
import com.dac.BackEnd.validation.UserStatusValidation;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public ResponsePage getPageInfo(int page, String by, String status, String searchText) {
        int totalBlogs = 0;
        int totalPages = 0;
        int perPage = 10;
        switch (by) {
            case "status":
                if (status != null) {
                    totalBlogs = (int) userRepository.countByStatus(UserStatusValidation.checkValidStatus(status));
                }
                break;
            case "searchText":
                if (searchText != null) {
                    totalBlogs = userRepository.countByTextInName(searchText);
                }
                break;
            default:
                totalBlogs = (int) userRepository.count();
                break;
        }

        if (totalBlogs == 0) {
            throw new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
        }

        totalPages = (int) Math.ceil((double) totalBlogs / perPage);

        if (page < 1 || page > totalPages) {
            throw new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
        }

        ResponsePage responsePage = new ResponsePage();
        responsePage.setPage(page);
        responsePage.setPer_page(perPage);
        responsePage.setTotal(totalBlogs);
        responsePage.setTotal_pages(totalPages);
        return responsePage;
    }


    @Override
    public List<User> getAllUser(int page) {
        return userRepository.findAll(PageRequest.of(page - 1, 10)).stream().map(UserConvertor::toModel).toList();
    }


    @Override
    public List<User> getAllUserByStatus(String status, int page) {
        return userRepository.findAllByStatus(UserStatusValidation.checkValidStatus(status), PageRequest.of(page - 1, 10))
                .stream()
                .map(UserConvertor::toModel)
                .toList();
    }


    @Override
    public List<User> getAllUserByText(String searchText, int page) {
        return userRepository.findByTextInName(searchText, PageRequest.of(page - 1, 10))
                .stream()
                .map(UserConvertor::toModel)
                .toList();
    }

    
    
}
