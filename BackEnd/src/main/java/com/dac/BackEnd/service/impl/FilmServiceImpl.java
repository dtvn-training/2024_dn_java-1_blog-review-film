package com.dac.BackEnd.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dac.BackEnd.constant.ErrorConstants;
import com.dac.BackEnd.constant.TypeImageConstants;
import com.dac.BackEnd.convertor.FilmConvertor;
import com.dac.BackEnd.entity.FilmEntity;
import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.entity.UserEntity.UserRole;
import com.dac.BackEnd.exception.MessageException;
import com.dac.BackEnd.model.Film;
import com.dac.BackEnd.model.request.DeleteRequest;
import com.dac.BackEnd.model.request.FilmInput;
import com.dac.BackEnd.model.response.ResponsePage;
import com.dac.BackEnd.repository.CategoryRepository;
import com.dac.BackEnd.repository.FilmRepository;
import com.dac.BackEnd.repository.UserRepository;
import com.dac.BackEnd.service.FilmService;
import com.dac.BackEnd.service.ImageService;


@Service
public class FilmServiceImpl implements FilmService{

    @Autowired
    private FilmRepository filmRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageService imageService;

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
        return filmRepository.findByDeleteFlagFalseOrderByInsertDateTimeDesc(PageRequest.of(page - 1, 10))
            .stream()
            .map(FilmConvertor::toModel)
            .toList();
    }

    @Override
    public List<Film> getAllBlogsByCategory(Long category, int page) {
        return filmRepository.findByCategoryAndDeleteFlagFalseOrderByInsertDateTimeDesc(categoryRepository.findById(category)
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

    @Override
    public Film createNewFilm(FilmInput filmInput) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
        }
        return FilmConvertor.toModel(saveFilm(filmInput, authentication.getName()));
    }

    private FilmEntity saveFilm(FilmInput filmInput, String user) {
        UserEntity userEntity = userRepository.findByEmailAndRole(user, UserRole.ROLE_ADMIN)
                                                .orElseThrow(() -> new MessageException(ErrorConstants.FORBIDDEN_MESSAGE, ErrorConstants.FORBIDDEN_CODE));
        LocalDateTime now = LocalDateTime.now();
        FilmEntity entity = new FilmEntity();
        entity.setCategory(categoryRepository.findById(filmInput.getCategoryId())
                            .orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE)));
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

    @Override
    public Film updateFilm(FilmInput filmInput, Long filmId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
        }
        FilmEntity entity = filmRepository.findById(filmId).orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
        entity.setCategory(categoryRepository.findById(filmInput.getCategoryId())
                            .orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE)));
        entity.setNameFilm(filmInput.getNameFilm());
        entity.setDirector(filmInput.getDirector());
        entity.setCountry(filmInput.getCountry());
        entity.setStartDate(filmInput.getStartDate());
        entity.setDescription(filmInput.getDescription());
        entity.setUpdateDateTime(LocalDateTime.now());
        entity.setUpdateBy(userRepository.findByEmailAndRole(authentication.getName(), UserRole.ROLE_ADMIN)
                                            .orElseThrow(() -> new MessageException(ErrorConstants.FORBIDDEN_MESSAGE, ErrorConstants.FORBIDDEN_CODE)));
        return FilmConvertor.toModel(filmRepository.save(entity));
    }

    @Override
    public Film updateImageFilm(MultipartFile file, Long filmId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
        }
        FilmEntity entity = filmRepository.findById(filmId).orElseThrow(() -> new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
        entity.setImage(imageService.upload(file, TypeImageConstants.FILM_IMAGE));
        entity.setUpdateDateTime(LocalDateTime.now());
        entity.setUpdateBy(userRepository.findByEmailAndRole(authentication.getName(), UserRole.ROLE_ADMIN)
                                            .orElseThrow(() -> new MessageException(ErrorConstants.FORBIDDEN_MESSAGE, ErrorConstants.FORBIDDEN_CODE)));
        return FilmConvertor.toModel(filmRepository.save(entity));
    }

    @Override
    public void deleteFilm(Long filmId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new MessageException(ErrorConstants.UNAUTHORIZED_MESSAGE, ErrorConstants.UNAUTHORIZED_CODE);
        }
        FilmEntity entity = filmRepository.findById(filmId).orElseThrow(() ->  new MessageException(ErrorConstants.NOT_FOUND_MESSAGE, ErrorConstants.NOT_FOUND_CODE));
        entity.setDeleteFlag(true);
        filmRepository.save(entity);
    }

    @Override
    public void deleteFilms(DeleteRequest deletes) {
        for (Long filmId : deletes.getIds()) {
            deleteFilm(filmId);
        }
    }
}
