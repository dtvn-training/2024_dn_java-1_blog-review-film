package com.dac.BackEnd.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dac.BackEnd.entity.BlogEntity.BlogEntity;
import com.dac.BackEnd.entity.BlogEntity.BlogStatus;
import com.dac.BackEnd.entity.UserEntity.UserEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.dac.BackEnd.entity.FilmEntity;

@Repository
public interface BlogRepository extends JpaRepository<BlogEntity, Long> {

        @Query("SELECT COUNT(*) FROM BlogEntity b WHERE b.deleteFlag = false")
        int countAllBlogs();

        @Query("SELECT COUNT(b) FROM BlogEntity b WHERE b.deleteFlag = false AND b.insertBy = :user")
        int countBlogsByReviewer(@Param("user") UserEntity user);

        long countByInsertByAndStatusAndDeleteFlagFalse(UserEntity userEntity, BlogStatus status);

        @Query("SELECT b FROM BlogEntity b JOIN b.film f JOIN b.insertBy r " +
                        "WHERE ((:userEntity IS NULL) OR (b.insertBy = :userEntity)) " +
                        "AND ((:status IS NULL) OR (b.status = :status)) " +
                        "AND (LOWER(b.title) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%')) " +
                        "OR LOWER(f.nameFilm) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%')) " +
                        "OR LOWER(r.name) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%'))) " +
                        "AND ((:startTime IS NULL) OR (b.postTime >= :startTime)) " +
                        "AND ((:endTime IS NULL) OR (b.postTime <= :endTime)) " +
                        "AND b.deleteFlag = false ORDER BY b.insertDateTime DESC")
        Page<BlogEntity> findAllBlogs(@Param("userEntity") UserEntity userEntity,
                        @Param("status") BlogStatus status,
                        @Param("searchTerm") String searchTerm,
                        @Param("startTime") LocalDateTime startTime,
                        @Param("endTime") LocalDateTime endTime,
                        Pageable pageable);

        @Query("SELECT b FROM BlogEntity b JOIN b.film f JOIN b.insertBy r " +
                        "WHERE b.status = BlogStatus.APPROVE " +
                        "AND b.insertBy.status = UserStatus.ACTIVE " +
                        "AND (LOWER(b.title) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%')) " +
                        "OR LOWER(f.nameFilm) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%')) " +
                        "OR LOWER(r.name) LIKE LOWER(CONCAT('%', COALESCE(:searchTerm, ''), '%'))) " +
                        "AND b.deleteFlag = false ORDER BY b.postTime DESC")
        Page<BlogEntity> findAllBlogsGuest(
                        @Param("searchTerm") String searchTerm,
                        Pageable pageable);

        @Query("SELECT b FROM BlogEntity b JOIN b.film f JOIN b.insertBy r " +
                        "WHERE b.id = :id " +
                        "AND b.insertBy.status = UserStatus.ACTIVE " +
                        "AND b.status = BlogStatus.APPROVE " +
                        "AND b.deleteFlag = false ORDER BY b.postTime DESC")
        Optional<BlogEntity> findBlogByIdGuest(
                        @Param("id") Long id);

        @Query("SELECT b FROM BlogEntity b JOIN b.film f JOIN b.insertBy r " +
                        "WHERE b.status = BlogStatus.APPROVE " +
                        "AND b.insertBy.status = UserStatus.ACTIVE " +
                        "AND f = :filmEntity " +
                        "AND b.deleteFlag = false ORDER BY b.postTime DESC")
        Page<BlogEntity> findAllBlogsByFilmGuest(
                        @Param("filmEntity") FilmEntity filmEntity,
                        Pageable pageable);
}
