package com.dac.BackEnd.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.convertor.BlogConvertor;
import com.dac.BackEnd.convertor.FilmConvertor;
import com.dac.BackEnd.model.response.HomeResponse;
import com.dac.BackEnd.repository.BlogRepository;
import com.dac.BackEnd.repository.FilmRepository;
import com.dac.BackEnd.service.HomeService;

@Service
public class HomeServiceImpl implements HomeService{
    
    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private FilmRepository filmRepository;

    private static final int PER_PAGE = 6;

    private static final String searchTerm = "";

    @Override
    public HomeResponse getBlogRecentAndTopFilm() {
        HomeResponse homeResponse = new HomeResponse();
        homeResponse.setRecentBlogs(blogRepository
                                    .findAllBlogsGuest(searchTerm, PageRequest.of(0, PER_PAGE))
                                    .getContent()
                                    .stream()
                                    .map(BlogConvertor::toModel)
                                    .toList());
        homeResponse.setTopFilms(filmRepository
                                    .findAllFilmsGuest(searchTerm, LocalDate.now(), PageRequest.of(0, PER_PAGE))
                                    .getContent()
                                    .stream()
                                    .map(FilmConvertor::toModel)
                                    .toList());


        return homeResponse;
    }
    
}
