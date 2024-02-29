package com.dac.BackEnd.controller.Admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.constant.SuccessConstants;
import com.dac.BackEnd.convertor.FilmConvertor;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.request.FilmInput;
import com.dac.BackEnd.model.response.Response;
import com.dac.BackEnd.model.response.ResponseBody;
import com.dac.BackEnd.model.response.ResponsesBody;
import com.dac.BackEnd.service.FilmService;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("api/admin/films")
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

    @PostMapping()
    public ResponseEntity<?> createNewFilm(@Valid FilmInput filmInput) {
        try {
            ResponseBody response = new ResponseBody();
            response.setCode(SuccessConstants.CREATED_CODE);
            response.setMessage(Arrays.asList(new MessageException(SuccessConstants.CREATED_MESSAGE), SuccessConstants.CREATED_CODE));
            response.setData(filmService.createNewFilm(filmInput));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (MessageException e) {
            Response response = new Response();
            response.setCode(e.getErrorCode());
            response.setMessage(Arrays.asList(e));
            return ResponseEntity.status(e.getErrorCode()).body(response);
        }
    }

    @PutMapping("{filmId}")
    public ResponseEntity<?> updateFilm(@RequestBody FilmInput input, @PathVariable Long filmId) {
        try {
            ResponseBody response = new ResponseBody();
            response.setCode(SuccessConstants.OK_CODE);
            response.setMessage(Arrays.asList(new MessageException(SuccessConstants.OK_MESSAGE), SuccessConstants.OK_CODE));
            response.setData(filmService.updateFilm(input, filmId));
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (MessageException e) {
            Response response = new Response();
            response.setCode(e.getErrorCode());
            response.setMessage(Arrays.asList(e));
            return ResponseEntity.status(e.getErrorCode()).body(response);
        }
    }

    @PatchMapping("{filmId}")
    public ResponseEntity<?> updateImageFilm(@RequestPart(value = "file") MultipartFile file, @PathVariable Long filmId) {
        try {
            ResponseBody response = new ResponseBody();
            response.setCode(SuccessConstants.OK_CODE);
            response.setMessage(Arrays.asList(new MessageException(SuccessConstants.OK_MESSAGE), SuccessConstants.OK_CODE));
            response.setData(filmService.updateImageFilm(file, filmId));
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (MessageException e) {
            Response response = new Response();
            response.setCode(e.getErrorCode());
            response.setMessage(Arrays.asList(e));
            return ResponseEntity.status(e.getErrorCode()).body(response);
        }
    }

    @DeleteMapping("{filmId}")
    public ResponseEntity<Response> deleteFilm(@PathVariable Long filmId) {
        try {
            Response response = new Response();
            response.setCode(SuccessConstants.OK_CODE);
            response.setMessage(Arrays.asList(new MessageException(SuccessConstants.OK_MESSAGE), SuccessConstants.OK_CODE));
            filmService.deleteFilm(filmId);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (MessageException e) {
            Response response = new Response();
            response.setCode(e.getErrorCode());
            response.setMessage(Arrays.asList(e));
            return ResponseEntity.status(e.getErrorCode()).body(response);
        }
        
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Response handleValidationExceptions(MethodArgumentNotValidException ex){
        Response response = new Response();
        response.setCode(ErrorConstants.INVALID_DATA_CODE);
        List<Object> messages = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach((error)->{
            String fieldName = ((FieldError) error).getField();
            messages.add(new MessageException(fieldName + ": " + error.getDefaultMessage(), response.getCode()));
        });
        response.setMessage(messages);
        return response;
    }
    
    
}
