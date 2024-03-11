package com.dac.BackEnd.service;

import java.util.List;

import com.dac.BackEnd.model.User;
import com.dac.BackEnd.model.request.ReviewerInput;
import com.dac.BackEnd.model.request.ReviewerUpdateInput;
import com.dac.BackEnd.model.request.StatusRequest;
import com.dac.BackEnd.model.request.DeleteRequest;
import com.dac.BackEnd.model.response.PagedResponse;
import com.dac.BackEnd.model.response.ResponsePage;

public interface UserService {

    PagedResponse<User> getAllUser(int page, String status, String searchText);

    User createNewReviewer(ReviewerInput input);

    User updateReviewer(ReviewerUpdateInput input, Long reviewerId);

    void deleteUser(Long reviewerId);

    void updateStatusReviewer(StatusRequest status);

    void deleteUsers(DeleteRequest deletes);
    
}
