package com.dac.BackEnd.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.constant.TypeImageConstants;
import com.dac.BackEnd.convertor.BlogConvertor;
import com.dac.BackEnd.convertor.FilmConvertor;
import com.dac.BackEnd.entity.CategoryEntity;
import com.dac.BackEnd.entity.FilmEntity;
import com.dac.BackEnd.entity.BlogEntity.BlogEntity;
import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.Blog;
import com.dac.BackEnd.model.Film;
import com.dac.BackEnd.model.request.DeleteRequest;
import com.dac.BackEnd.model.request.FilmInput;
import com.dac.BackEnd.model.response.PagedResponse;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.repository.CategoryRepository;
import com.dac.BackEnd.repository.FilmRepository;
import com.dac.BackEnd.repository.UserRepository;
import com.dac.BackEnd.service.FilmService;
import com.dac.BackEnd.service.ImageService;


@Service
public class FilmServiceImpl implements FilmService {

    @Autowired
    private FilmRepository filmRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageService imageService;

    private static final int PER_PAGE = 10;

    private static final int PER_PAGE_GUEST = 6;

    public ResponsePage getPageInfo(Page<FilmEntity> film, int page, int per_page) {
        ResponsePage responsePage = new ResponsePage();
        responsePage.setPage(page);
        responsePage.setPer_page(per_page);
        responsePage.setTotal(film.getTotalElements());
        responsePage.setTotal_pages(film.getTotalPages());
        return responsePage;
    }

    @Override
    public PagedResponse<Film> getAllFilm(int page, Long category, String searchText, LocalDate startTime, LocalDate endTime) {
        Page<FilmEntity> filmEntities = getFilmEntities(category, searchText, startTime, endTime, PageRequest.of(page - 1, PER_PAGE));
        PagedResponse<Film> pagedResponse = new PagedResponse<>();
        pagedResponse.setContent(filmEntities.getContent().stream().map(FilmConvertor::toModel).toList());
        pagedResponse.setResponsePage(getPageInfo(filmEntities, page, PER_PAGE));
        return pagedResponse;
    }

    @Override
    public Film createNewFilm(FilmInput filmInput) {
        Authentication authentication = getAuthentication();
        return FilmConvertor.toModel(saveFilm(filmInput, authentication.getName()));
    }

    @Override
    public Film updateFilm(FilmInput filmInput, Long filmId) {
        Authentication authentication = getAuthentication();
        FilmEntity entity = getFilmEntityById(filmId);
        updateFilmEntity(entity, filmInput, authentication.getName());
        return FilmConvertor.toModel(filmRepository.save(entity));
    }

    @Override
    public Film updateImageFilm(MultipartFile file, Long filmId) {
        Authentication authentication = getAuthentication();
        FilmEntity entity = getFilmEntityById(filmId);
        updateFilmImage(entity, file, authentication.getName());
        return FilmConvertor.toModel(filmRepository.save(entity));
    }

    @Override
    public void deleteFilm(Long filmId) {
        Authentication authentication = getAuthentication();
        FilmEntity entity = getFilmEntityById(filmId);
        deleteFilmEntity(entity, authentication.getName());
    }

    @Override
    public void deleteFilms(DeleteRequest deletes) {
        for (Long filmId : deletes.getIds()) {
            deleteFilm(filmId);
        }
    }

    private FilmEntity saveFilm(FilmInput filmInput, String user) {
        UserEntity userEntity = getUserEntity(user);
        LocalDateTime now = LocalDateTime.now();
        FilmEntity entity = new FilmEntity();
        entity.setCategory(getCategoryEntityById(filmInput.getCategoryId()));
        entity.setNameFilm(filmInput.getNameFilm());
        entity.setImage(imageService.upload(filmInput.getFilmImage(), TypeImageConstants.FILM_IMAGE));
        entity.setDirector(filmInput.getDirector());
        entity.setCountry(filmInput.getCountry());
        entity.setStartDate(filmInput.getStartDate());
        entity.setDescription(filmInput.getDescription());
        entity.setInsertDateTime(now);
        entity.setUpdateDateTime(now);
        entity.setInsertBy(userEntity);
        entity.setUpdateBy(userEntity);
        entity.setDeleteFlag(false);
        return filmRepository.save(entity);
    }
    

    private void updateFilmEntity(FilmEntity entity, FilmInput filmInput, String user) {
        UserEntity userEntity = getUserEntity(user);
        entity.setCategory(getCategoryEntityById(filmInput.getCategoryId()));
        entity.setNameFilm(filmInput.getNameFilm());
        entity.setDirector(filmInput.getDirector());
        entity.setCountry(filmInput.getCountry());
        entity.setStartDate(filmInput.getStartDate());
        entity.setDescription(filmInput.getDescription());
        entity.setUpdateDateTime(LocalDateTime.now());
        entity.setUpdateBy(userEntity);
    }

    private void updateFilmImage(FilmEntity entity, MultipartFile file, String user) {
        UserEntity userEntity = getUserEntity(user);
        entity.setImage(imageService.upload(file, TypeImageConstants.FILM_IMAGE));
        entity.setUpdateDateTime(LocalDateTime.now());
        entity.setUpdateBy(userEntity);
    }

    private void deleteFilmEntity(FilmEntity entity, String user) {
        UserEntity userEntity = getUserEntity(user);
        entity.setDeleteFlag(true);
        entity.setUpdateDateTime(LocalDateTime.now());
        entity.setUpdateBy(userEntity);
        filmRepository.save(entity);
    }

    private Authentication getAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throwUnauthorizedException();
        }
        return authentication;
    }

    private UserEntity getUserEntity(String username) {
        return userRepository.findUserByDeleteFlagFalseAndEmail(username)
                .orElseThrow(this::notFoundException);
    }

    private Page<FilmEntity> getFilmEntities(Long category, String searchText, LocalDate startTime, LocalDate endTime, Pageable pageable) {
        return filmRepository.findAllFilms(category == null ? null : getCategoryEntityById(category), searchText, startTime, endTime, pageable);
    }

    private FilmEntity getFilmEntityById(Long filmId) {
        return filmRepository.findById(filmId)
                .orElseThrow(this::notFoundException);
    }

    private CategoryEntity getCategoryEntityById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(this::notFoundException);
    }

    private void throwUnauthorizedException() {
        throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
    }

    private void throwNotFoundException() {
        throw new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
    }

    private MessageException notFoundException() {
        return new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE);
    }

    @Override
    public List<Film> getAllFilmSelect() {
        return filmRepository.findByDeleteFlagFalse().stream().map(FilmConvertor::toModel).toList();
    }

    @Override
    public PagedResponse<Film> getAllFilmGuest(int page, String searchText) {
        Page<FilmEntity> blog = filmRepository.findAllFilmsGuest(searchText, LocalDate.now(), PageRequest.of(page - 1, PER_PAGE_GUEST));
        PagedResponse<Film> pagedResponse = new PagedResponse<>();
        pagedResponse.setContent(blog.getContent().stream().map(FilmConvertor::toModel).toList());
        pagedResponse.setResponsePage(getPageInfo(blog, page, PER_PAGE_GUEST));
        return pagedResponse;
    }
}

