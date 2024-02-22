package com.dac.BackEnd.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.convertor.FilmConvertor;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.Film;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.repository.CategoryRepository;
import com.dac.BackEnd.repository.FilmRepository;
import com.dac.BackEnd.service.FilmService;

@Service
public class FilmServiceImpl implements FilmService{

    @Autowired
    private FilmRepository filmRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public ResponsePage getPageInfo(int page, String by, Long category, String searchText, LocalDate startTime, LocalDate endTime) {
        int totalFilm = 0;
        int totalPages = 0;
        int perPage = 10;
        switch (by) {
            case "category":
                if (category != null) {
                    totalFilm = filmRepository.countAllFilmByCategory(categoryRepository.findById(category).orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE)));
                }
                break;
            case "searchText":
                if (searchText != null) {
                    totalFilm = filmRepository.countAllFilmByText(searchText);
                }
                break;
            case "startDate":
                if (startTime != null && endTime != null) {
                    totalFilm = filmRepository.countAllBlogsByStartDate(startTime, endTime);
                }
                break;
            default:
                totalFilm = filmRepository.countAllFilm();
                break;
        }

        if (totalFilm == 0) {
            throw new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
        }

        totalPages = (int) Math.ceil((double) totalFilm / perPage);

        if (page < 1 || page > totalPages) {
            throw new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
        }

        ResponsePage responsePage = new ResponsePage();
        responsePage.setPage(page);
        responsePage.setPer_page(perPage);
        responsePage.setTotal(totalFilm);
        responsePage.setTotal_pages(totalPages);
        return responsePage;
    }

    @Override
    public List<Film> getAllFilm(int page) {
        return filmRepository.findAll(PageRequest.of(page - 1, 10))
            .stream()
            .map(FilmConvertor::toModel)
            .toList();
    }

    @Override
    public List<Film> getAllBlogsByCategory(Long category, int page) {
        return filmRepository.findByCategory(categoryRepository.findById(category)
            .orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE)), PageRequest.of(page - 1, 10))
            .stream()
            .map(FilmConvertor::toModel)
            .toList();
    }

    @Override
    public List<Film> getAllFilmByText(String searchText, int page) {
        return filmRepository.findAllBySearchText(searchText, PageRequest.of(page - 1, 10))
            .stream()
            .map(FilmConvertor::toModel)
            .toList();
    }

    @Override
    public List<Film> getAllFilmByStartDate(LocalDate startTime, LocalDate endTime, int page) {
        return filmRepository.findAllByStartDate(startTime, endTime, PageRequest.of(page - 1, 10))
            .stream()
            .map(FilmConvertor::toModel)
            .toList();
    }

    @Override
    public List<Film> getAllFilmDeleteFalse() {
        return filmRepository.findAllReleasedFilms(LocalDate.now()).stream().map(FilmConvertor::toModel).toList();
    }
}
