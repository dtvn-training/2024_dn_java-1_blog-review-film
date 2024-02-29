package com.dac.BackEnd.repository;

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

@Repository
public interface BlogRepository extends JpaRepository<BlogEntity, Long>{

    @Query("SELECT COUNT(*) FROM BlogEntity b WHERE b.deleteFlag = false")
    int countAllBlogs();

    @Query("SELECT COUNT(*) FROM BlogEntity b WHERE b.status = :status AND b.deleteFlag = false")
    int countAllBlogsByStatus(@Param("status") BlogStatus status);

    @Query("SELECT COUNT(b) FROM BlogEntity b JOIN b.film f JOIN b.insertBy r WHERE (b.title LIKE %:searchTerm% OR f.nameFilm LIKE %:searchTerm% OR r.name LIKE %:searchTerm%) AND b.deleteFlag = false")
    int countAllBlogsByText(String searchTerm);

    @Query("SELECT COUNT(b) FROM BlogEntity b WHERE (b.postTime BETWEEN :startTime AND :endTime) AND b.deleteFlag = false")
    int countAllBlogsByPostTime(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    List<BlogEntity> findAllByDeleteFlagFalseOrderByInsertDateTimeDesc(Pageable pageable);

    List<BlogEntity> findAllByStatusAndDeleteFlagFalseOrderByInsertDateTimeDesc(BlogStatus status, Pageable pageable);

    @Query("SELECT b FROM BlogEntity b JOIN b.film f JOIN b.insertBy r WHERE (b.title LIKE %:searchTerm% OR f.nameFilm LIKE %:searchTerm% OR r.name LIKE %:searchTerm%) AND b.deleteFlag = false ORDER BY b.insertDateTime DESC")
    List<BlogEntity> findAllBySearchText(@Param("searchTerm") String searchTerm, Pageable pageable);

    List<BlogEntity> findAllByDeleteFlagFalseAndPostTimeBetweenOrderByInsertDateTimeDesc(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    @Query("SELECT COUNT(b) FROM BlogEntity b WHERE b.deleteFlag = false AND b.insertBy = :user")
    int countBlogsByReviewer(@Param("user") UserEntity user);

    @Query("SELECT b FROM BlogEntity b WHERE b.deleteFlag = false AND b.insertBy = :user")
    List<BlogEntity> getBlogsByReviewer(@Param("user") UserEntity user);

    @Query("SELECT COUNT(b) FROM BlogEntity b WHERE (b.status = BlogStatus.WAITING OR b.insertBy = :user) AND b.deleteFlag = false")
    int countAllBlogsByStatus(@Param("user") UserEntity user);

    long countByInsertByAndStatusAndDeleteFlagFalse(UserEntity userEntity, BlogStatus status);

}
