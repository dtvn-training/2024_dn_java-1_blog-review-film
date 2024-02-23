package com.dac.BackEnd.service;

import java.util.List;

import com.dac.BackEnd.model.User;
import com.dac.BackEnd.model.request.ReviewerInput;
import com.dac.BackEnd.model.response.ResponsePage;

public interface UserService {

    List<User> getAllUser(int page);

    ResponsePage getPageInfo(int page, String by, String status, String searchText);

    List<User> getAllUserByStatus(String status, int page);

    List<User> getAllUserByText(String searchText, int page);

    User createNewReviewer(ReviewerInput input);
    
}
