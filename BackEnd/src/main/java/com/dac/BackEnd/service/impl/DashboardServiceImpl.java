package com.dac.BackEnd.service.impl;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.entity.BlogEntity.BlogStatus;
import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.entity.UserEntity.UserRole;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.response.SummaryResponse;
import com.dac.BackEnd.repository.BlogRepository;
import com.dac.BackEnd.repository.FilmRepository;
import com.dac.BackEnd.repository.UserRepository;
import com.dac.BackEnd.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService{
    
    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private FilmRepository filmRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public SummaryResponse getInfoSummary() {
        SummaryResponse response = new SummaryResponse();
        response.setTotalBlog(Long.valueOf(blogRepository.countAllBlogs()));
        response.setTotalFilm(Long.valueOf(filmRepository.countAllFilm()));
        response.setTotalReviewer(Long.valueOf(userRepository.countAllReviewer()));
        return response;


    }

    @Override
    public SummaryResponse getInfoSummaryByReviewer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
        }
        UserEntity user = userRepository.findByEmail(authentication.getName()).orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));;
        SummaryResponse response = new SummaryResponse();
        response.setTotalBlog(Long.valueOf(blogRepository.countBlogsByReviewer(user)));
        response.setTotalFilm(Long.valueOf(filmRepository.countReleasedFilms(LocalDate.now())));
        response.setTotalReviewer(Long.valueOf(blogRepository.countByInsertByAndStatusAndDeleteFlagFalse(user, BlogStatus.WAITING)));
        return response;
    }
}
