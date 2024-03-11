package com.dac.BackEnd.convertor;

import java.util.ArrayList;
import java.util.List;

import com.dac.BackEnd.entity.FilmEntity;
import com.dac.BackEnd.model.Film;

public class FilmConvertor {

    public static Film toModel(FilmEntity entity) {
        Film film = new Film();
        film.setId(entity.getId());
        film.setCategory(CategoryConvertor.toModel(entity.getCategory()));
        film.setNameFilm(entity.getNameFilm());
        film.setImage(entity.getImage());
        film.setDirector(entity.getDirector());
        film.setCountry(entity.getCountry());
        film.setStartDate(entity.getStartDate());
        film.setDescription(entity.getDescription());
        film.setInsertDateTime(entity.getInsertDateTime());
        film.setInsertBy(UserConvertor.toModel(entity.getInsertBy()));
        film.setUpdateDateTime(entity.getUpdateDateTime());
        film.setUpdateBy(UserConvertor.toModel(entity.getUpdateBy()));
        film.setDeleteFlag(entity.getDeleteFlag());
        return film;
    }

    public static List<Object> convertToObjects(List<Film> films) {
        List<Object> objects = new ArrayList<>();
        for (Film film : films) {
            objects.add(film);
        }
        return objects;
    }
}
