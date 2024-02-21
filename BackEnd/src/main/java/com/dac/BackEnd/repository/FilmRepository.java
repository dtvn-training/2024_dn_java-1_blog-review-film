package com.dac.BackEnd.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dac.BackEnd.entity.CategoryEntity;
import com.dac.BackEnd.entity.FilmEntity;

@Repository
public interface FilmRepository extends JpaRepository<FilmEntity, Long>{

    @Query("SELECT COUNT(*) FROM FilmEntity")
    int countAllFilm();

    @Query("SELECT COUNT(f) FROM FilmEntity f WHERE f.category = :category")
    int countAllFilmByCategory(CategoryEntity category);

    @Query("SELECT COUNT(f) FROM FilmEntity f WHERE f.nameFilm LIKE %:searchText% OR f.description LIKE %:searchText%")
    int countAllFilmByText(String searchText);

    @Query("SELECT COUNT(f) FROM FilmEntity f WHERE f.startDate BETWEEN :startTime AND :endTime")
    int countAllBlogsByStartDate(LocalDate startTime, LocalDate endTime);

    List<FilmEntity> findByCategory(CategoryEntity category, Pageable pageable);

    @Query("SELECT f FROM FilmEntity f WHERE f.nameFilm LIKE %:searchText% OR f.description LIKE %:searchText%")
    List<FilmEntity> findAllBySearchText(String searchText, Pageable pageable);
    
    @Query("SELECT f FROM FilmEntity f WHERE f.startDate BETWEEN :startTime AND :endTime")
    List<FilmEntity> findAllByStartDate(LocalDate startTime, LocalDate endTime, Pageable pageable);

    @Query("SELECT f FROM FilmEntity f WHERE f.deleteFlag = false AND f.startDate <= :currentDate")
    List<FilmEntity> findAllReleasedFilms(@Param("currentDate") LocalDate currentDate);
}
