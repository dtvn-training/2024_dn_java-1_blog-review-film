package com.dac.BackEnd.service;

import java.time.LocalDate;
import java.util.List;

import com.dac.BackEnd.model.Film;
import com.dac.BackEnd.model.response.ResponsePage;


public interface FilmService {

    ResponsePage getPageInfo(int page, String by, Long category, String searchText, LocalDate startTime, LocalDate endTime);

    List<Film> getAllFilm(int page);

    List<Film> getAllBlogsByCategory(Long category, int page);

    List<Film> getAllFilmByText(String searchText, int page);

    List<Film> getAllFilmByStartDate(LocalDate startTime, LocalDate endTime, int page);

    List<Film> getAllFilmDeleteFalse();
    
}
