package com.dac.BackEnd.controller.Admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dac.BackEnd.constant.SuccessConstants;
import com.dac.BackEnd.convertor.FilmConvertor;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponsesBody;
import com.dac.BackEnd.service.FilmService;

import java.time.LocalDate;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("api/admin/film")
public class FilmsAdminController {

    @Autowired
    private FilmService filmService;
    
    @GetMapping()
    public ResponseEntity<?> getAllFilm(@RequestParam(required = false, defaultValue = "1") int page,
                                        @RequestParam(required = false) Long category,
                                        @RequestParam(required = false) String searchText,
                                        @RequestParam(required = false) LocalDate startTime,
                                        @RequestParam(required = false) LocalDate endTime) {
        try {
            ResponsesBody body = new ResponsesBody();
            if (category != null) {
                body.setData(FilmConvertor.convertToObjects(filmService.getAllBlogsByCategory(category, page)));
                body.setPageInfo(filmService.getPageInfo(page, "category", category, searchText, startTime, endTime));
            } else if (searchText != null) {
                body.setData(FilmConvertor.convertToObjects(filmService.getAllFilmByText(searchText, page)));
                body.setPageInfo(filmService.getPageInfo(page, "searchText", category, searchText, startTime, endTime));
            } else if (startTime != null && endTime != null) {
                body.setData(FilmConvertor.convertToObjects(filmService.getAllFilmByStartDate(startTime, endTime, page)));
                body.setPageInfo(filmService.getPageInfo(page, "startDate", category, searchText, startTime, endTime));
            } else {
                body.setData(FilmConvertor.convertToObjects(filmService.getAllFilm(page)));
                body.setPageInfo(filmService.getPageInfo(page, "all", category, searchText, startTime, endTime));
            }

            body.setCode(SuccessConstants.OK_CODE);
            body.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE));
            return ResponseEntity.ok().body(body);
        } catch (MessageException e) {
            Response body = new Response();
            body.setCode(e.getErrorCode());
            body.setMessage(Arrays.asList(e));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
        
    }
    
}
