package com.dac.BackEnd.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.convertor.UserConvertor;
import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.entity.UserEntity.UserRole;
import com.dac.BackEnd.entity.UserEntity.UserStatus;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.User;
import com.dac.BackEnd.model.request.ReviewerInput;
import com.dac.BackEnd.model.request.UserStatusRequest;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.repository.UserRepository;
import com.dac.BackEnd.service.UserService;
import com.dac.BackEnd.validation.UserStatusValidation;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public ResponsePage getPageInfo(int page, String by, String status, String searchText) {
        int totalReivewer = 0;
        int totalPages = 0;
        int perPage = 10;
        switch (by) {
            case "status":
                if (status != null) {
                    totalReivewer = (int) userRepository.countReviewerByStatus(UserStatusValidation.checkValidStatus(status));
                }
                break;
            case "searchText":
                if (searchText != null) {
                    totalReivewer = userRepository.countReviewerByTextInName(searchText);
                }
                break;
            default:
            totalReivewer = (int) userRepository.countAllReviewer();
                break;
        }

        if (totalReivewer == 0) {
            throw new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
        }

        totalPages = (int) Math.ceil((double) totalReivewer / perPage);

        if (page < 1 || page > totalPages) {
            throw new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
        }

        ResponsePage responsePage = new ResponsePage();
        responsePage.setPage(page);
        responsePage.setPer_page(perPage);
        responsePage.setTotal(totalReivewer);
        responsePage.setTotal_pages(totalPages);
        return responsePage;
    }


    @Override
    public List<User> getAllUser(int page) {
        return userRepository.findAllReviewer(PageRequest.of(page - 1, 10)).stream().map(UserConvertor::toModel).toList();
    }


    @Override
    public List<User> getAllUserByStatus(String status, int page) {
        return userRepository.findAllReviewersByStatus(UserStatusValidation.checkValidStatus(status), PageRequest.of(page - 1, 10))
                .stream()
                .map(UserConvertor::toModel)
                .toList();
    }


    @Override
    public List<User> getAllUserByText(String searchText, int page) {
        return userRepository.findReviewerByTextInName(searchText, PageRequest.of(page - 1, 10))
                .stream()
                .map(UserConvertor::toModel)
                .toList();
    }


    @Override
    public User createNewReviewer(ReviewerInput user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new MessageException(ErrorConstants.EMAIL_ALREADY_EXISTS_MESSAGE, ErrorConstants.EMAIL_ALREADY_EXISTS_CODE);
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        LocalDateTime now = LocalDateTime.now();
        UserEntity entity = new UserEntity();
        entity.setEmail(user.getEmail());
        entity.setPassword(passwordEncoder.encode(user.getPassword()));
        entity.setRole(UserRole.ROLE_REVIEWER);
        entity.setName(user.getName());
        entity.setPhone(user.getPhone());
        entity.setStatus(UserStatus.SUSPENDED);
        Set<String> roles = AuthorityUtils.authorityListToSet(authentication.getAuthorities());
        if (roles.contains("ROLE_ADMIN")) {
            UserEntity userEntity = userRepository.findUserByDeleteFlagFalseAndEmail(authentication.getName())
                                                .orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
            entity.setStatus(UserStatus.ACTIVE);
            entity.setInsertByUserId(userEntity.getId());
            entity.setUpdateByUserId(userEntity.getId());
        }
        entity.setInsertDateTime(now);
        entity.setUpdateDateTime(now);
        entity.setDeleteFlag(false);
        return UserConvertor.toModel(userRepository.save(entity));
    }


    @Override
    public User updateReivewer(ReviewerInput input, Long reviewerId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
        }
        UserEntity entity = userRepository.findById(reviewerId).orElseThrow(() ->  new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
        UserEntity existingEntity = updateUser(entity, input, authentication.getName());

        return UserConvertor.toModel(existingEntity);
    }


    private UserEntity updateUser(UserEntity entity, ReviewerInput input, String authenName) {
        entity.setName(input.getName());
        entity.setPhone(input.getPhone());
        UserEntity user = userRepository.findByEmailAndRole(authenName, UserRole.ROLE_ADMIN).orElseThrow(() ->  new MessageException(ErrorConstants.FORBIDDEN_MESSAGE, ErrorConstants.FORBIDDEN_CODE));
        entity.setUpdateByUserId(user.getId());
        entity.setUpdateDateTime(LocalDateTime.now());
        return userRepository.save(entity);
    }

    @Override
    public Object updateStatusReivewer(UserStatusRequest status, Long reviewerId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
        }
        UserStatus userStatus = UserStatusValidation.checkValidStatus(status.getStatus());
        UserEntity entity = userRepository.findById(reviewerId).orElseThrow(() ->  new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
        entity.setStatus(userStatus);
        entity.setUpdateByUserId(userRepository
                                    .findByEmailAndRole(authentication.getName(), UserRole.ROLE_ADMIN)
                                    .orElseThrow(() ->  new MessageException(ErrorConstants.FORBIDDEN_MESSAGE, ErrorConstants.FORBIDDEN_CODE))
                                    .getId());
        entity.setUpdateDateTime(LocalDateTime.now());
        return UserConvertor.toModel(userRepository.save(entity));
    }


    @Override
    public void deleteUser(Long reviewerId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
        }
        UserEntity entity = userRepository.findById(reviewerId).orElseThrow(() ->  new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
        if (entity.getDeleteFlag()) {
            throw new MessageException(ErrorConstants.INVALID_DATA_MESSAGE, ErrorConstants.INVALID_DATA_CODE);
        }
        entity.setDeleteFlag(true);
        userRepository.save(entity);

    }


    
}
