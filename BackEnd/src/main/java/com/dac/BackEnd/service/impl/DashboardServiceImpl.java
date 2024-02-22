package com.dac.BackEnd.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.entity.UserEntity.UserRole;
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
        response.setTotalReviewer(Long.valueOf(userRepository.countByRole(UserRole.ROLE_REVIEWER)));
        return response;


    }
}
