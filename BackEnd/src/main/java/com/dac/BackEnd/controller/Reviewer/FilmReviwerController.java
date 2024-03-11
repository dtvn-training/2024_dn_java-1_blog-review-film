package com.dac.BackEnd.controller.Reviewer;

import java.time.LocalDate;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dac.BackEnd.constant.SuccessConstants;
import com.dac.BackEnd.convertor.FilmConvertor;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.Film;
import com.dac.BackEnd.model.response.PagedResponse;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponsesBody;
import com.dac.BackEnd.service.FilmService;

@RestController
@RequestMapping("api/reviewer/films")
public class FilmReviwerController {

    @Autowired
    private FilmService filmService;

    @GetMapping()
    public ResponseEntity<?> getAllFilm(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false, defaultValue = "") String searchText,
            @RequestParam(required = false) LocalDate startTime,
            @RequestParam(required = false) LocalDate endTime) {
        try {
            ResponsesBody body = new ResponsesBody();
            body.setCode(SuccessConstants.OK_CODE);
            body.setMessage(Arrays.asList(SuccessConstants.OK_MESSAGE));
            PagedResponse<Film> pagedResponse = filmService.getAllFilm(page, category, searchText, startTime, endTime);
            body.setData(FilmConvertor.convertToObjects(pagedResponse.getContent()));
            body.setPageInfo(pagedResponse.getResponsePage());
            return ResponseEntity.ok().body(body);
        } catch (MessageException e) {
            Response body = new Response();
            body.setCode(e.getErrorCode());
            body.setMessage(Arrays.asList(e));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
    }
}
