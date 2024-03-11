package com.dac.BackEnd.service.impl;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import com.dac.BackEnd.model.request.ReviewerUpdateInput;
import com.dac.BackEnd.model.request.StatusRequest;
import com.dac.BackEnd.model.request.DeleteRequest;
import com.dac.BackEnd.model.response.PagedResponse;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.repository.UserRepository;
import com.dac.BackEnd.service.UserService;
import com.dac.BackEnd.validation.UserStatusValidation;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final int PER_PAGE = 10;

    public ResponsePage getPageInfo(Page<UserEntity> user, int page) {
        ResponsePage responsePage = new ResponsePage();
        responsePage.setPage(page);
        responsePage.setPer_page(PER_PAGE);
        responsePage.setTotal(user.getTotalElements());
        responsePage.setTotal_pages(user.getTotalPages());
        return responsePage;
    }

    @Override
    public PagedResponse<User> getAllUser(int page, String status, String searchText) {
        Page<UserEntity> userEntities = getUserEntities(UserStatusValidation.checkValidStatus(status), searchText,
                PageRequest.of(page - 1, PER_PAGE));
        PagedResponse<User> pagedResponse = new PagedResponse<>();
        pagedResponse.setContent(userEntities.getContent().stream().map(UserConvertor::toModel).toList());
        pagedResponse.setResponsePage(getPageInfo(userEntities, page));
        return pagedResponse;
    }

    @Override
    public User createNewReviewer(ReviewerInput user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new MessageException(ErrorConstants.EMAIL_ALREADY_EXISTS_MESSAGE,
                    ErrorConstants.EMAIL_ALREADY_EXISTS_CODE);
        }
        LocalDateTime now = LocalDateTime.now();
        UserEntity entity = buildUserEntityFromInput(user, now);
        return UserConvertor.toModel(userRepository.save(entity));
    }

    private UserEntity buildUserEntityFromInput(ReviewerInput user, LocalDateTime now) {
        Authentication authentication = getAuthentication();
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
                    .orElseThrow(() -> notFoundException());
            entity.setStatus(UserStatus.ACTIVE);
            entity.setInsertByUserId(userEntity.getId());
            entity.setUpdateByUserId(userEntity.getId());
        }
        entity.setInsertDateTime(now);
        entity.setUpdateDateTime(now);
        entity.setDeleteFlag(false);
        return entity;
    }

    @Override
    public User updateReviewer(ReviewerUpdateInput input, Long reviewerId) {
        Authentication authentication = getAuthentication();
        UserEntity entity = userRepository.findById(reviewerId)
                .orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
        UserEntity existingEntity = updateUser(entity, input, authentication.getName());
        return UserConvertor.toModel(existingEntity);
    }

    private UserEntity updateUser(UserEntity entity, ReviewerUpdateInput input, String name) {
        entity.setName(input.getName());
        entity.setPhone(input.getPhone());
        UserEntity user = userRepository.findByEmailAndRole(name, UserRole.ROLE_ADMIN)
                .orElseThrow(() -> new MessageException(ErrorConstants.FORBIDDEN_MESSAGE, ErrorConstants.FORBIDDEN_CODE));
        entity.setUpdateByUserId(user.getId());
        entity.setUpdateDateTime(LocalDateTime.now());
        return userRepository.save(entity);
    }

    @Override
    public void updateStatusReviewer(StatusRequest status) {
        for (Long reviewerId : status.getIds()) {
            Authentication authentication = getAuthentication();
            UserStatus userStatus = UserStatusValidation.checkValidStatus(status.getStatus());
            UserEntity entity = userRepository.findById(reviewerId)
                    .orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
            entity.setStatus(userStatus);
            entity.setUpdateByUserId(userRepository.findByEmailAndRole(authentication.getName(), UserRole.ROLE_ADMIN)
                    .orElseThrow(() -> new MessageException(ErrorConstants.FORBIDDEN_MESSAGE, ErrorConstants.FORBIDDEN_CODE))
                    .getId());
            entity.setUpdateDateTime(LocalDateTime.now());
            userRepository.save(entity);
        }
    }

    @Override
    public void deleteUser(Long reviewerId) {
        Authentication authentication = getAuthentication();
        UserEntity entity = userRepository.findById(reviewerId)
                .orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
        if (entity.getDeleteFlag()) {
            throw new MessageException(ErrorConstants.INVALID_DATA_MESSAGE, ErrorConstants.INVALID_DATA_CODE);
        }
        entity.setDeleteFlag(true);
        userRepository.save(entity);
    }

    @Override
    public void deleteUsers(DeleteRequest deletes) {
        for (Long reviewerId : deletes.getIds()) {
            deleteUser(reviewerId);
        }
    }

    private Authentication getAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throwUnauthorizedException();
        }
        return authentication;
    }

    private void throwUnauthorizedException() {
        throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
    }

    private Page<UserEntity> getUserEntities(UserStatus userStatus, String searchText, Pageable pageable) {
        return userRepository.findAllReviewers(userStatus, searchText, pageable);
    }

    private MessageException notFoundException() {
        return new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
    }

}
