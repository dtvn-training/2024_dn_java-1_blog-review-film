package com.dac.BackEnd.controller;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dac.BackEnd.constant.SuccessConstants;
import com.dac.BackEnd.convertor.FilmConvertor;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponsesBody;
import com.dac.BackEnd.service.FilmService;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("api/films")
public class FilmController {
    
    @Autowired
    private FilmService filmService;

    @GetMapping()
    public ResponseEntity<?> getAllFilmDeleteFalse() {
        try {
            ResponsesBody body = new ResponsesBody();
            body.setData(FilmConvertor.convertToObjects(filmService.getAllFilmDeleteFalse()));
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
