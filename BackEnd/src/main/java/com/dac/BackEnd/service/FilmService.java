package com.dac.BackEnd.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.dac.BackEnd.model.Film;
import com.dac.BackEnd.model.request.DeleteRequest;
import com.dac.BackEnd.model.request.FilmInput;
import com.dac.BackEnd.model.response.PagedResponse;



public interface FilmService {

    PagedResponse<Film> getAllFilm(int page, Long category, String searchText, LocalDate startTime, LocalDate endTime);

    Film createNewFilm(FilmInput filmInput);

    Film updateFilm(FilmInput input, Long filmId);

    Film updateImageFilm(MultipartFile file, Long filmId);

    void deleteFilm(Long filmId);

    void deleteFilms(DeleteRequest deletes);

    List<Film> getAllFilmSelect();

    PagedResponse<Film> getAllFilmGuest(int page, String searchText);
    
}
