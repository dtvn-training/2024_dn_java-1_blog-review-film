package com.dac.BackEnd.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dac.BackEnd.entity.CategoryEntity;
import com.dac.BackEnd.entity.FilmEntity;

@Repository
public interface FilmRepository extends JpaRepository<FilmEntity, Long> {

        @Query("SELECT COUNT(*) FROM FilmEntity f WHERE f.deleteFlag = false")
        int countAllFilm();

        @Query("SELECT COUNT(f) FROM FilmEntity f WHERE f.deleteFlag = false AND f.startDate <= :currentDate ORDER BY f.insertDateTime DESC")
        int countReleasedFilms(@Param("currentDate") LocalDate currentDate);

        @Query("SELECT f FROM FilmEntity f JOIN f.category c " +
                        "WHERE ((:categoryEntity IS NULL) OR (f.category = :categoryEntity)) " +
                        "AND (LOWER(f.nameFilm) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%')) " +
                        "OR LOWER(f.director) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%')) " +
                        "OR LOWER(f.country) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%')) " +
                        "OR LOWER(f.description) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%'))) " +
                        "AND ((:startDate IS NULL) OR (f.startDate >= :startDate)) " +
                        "AND ((:endDate IS NULL) OR (f.startDate <= :endDate)) " +
                        "AND f.deleteFlag = false ORDER BY f.insertDateTime DESC")
        Page<FilmEntity> findAllFilms(
                        @Param("categoryEntity") CategoryEntity categoryEntity,
                        @Param("searchTerm") String searchTerm,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        Pageable pageable);

        @Query("SELECT f FROM FilmEntity f " +
                        "WHERE ((:currentDate IS NULL) OR (f.startDate <= :currentDate)) " +
                        "AND (LOWER(f.nameFilm) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%')) " +
                        "OR LOWER(f.director) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%')) " +
                        "OR LOWER(f.country) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%')) " +
                        "OR LOWER(f.description) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%'))) " +
                        "AND f.deleteFlag = false ORDER BY f.insertDateTime DESC")
        Page<FilmEntity> findAllFilmsGuest(
                        @Param("searchTerm") String searchTerm,
                        @Param("currentDate") LocalDate currentDate,
                        Pageable pageable);

        List<FilmEntity> findByDeleteFlagFalse();
}
