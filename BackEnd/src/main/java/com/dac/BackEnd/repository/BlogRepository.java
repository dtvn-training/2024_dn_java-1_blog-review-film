package com.dac.BackEnd.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dac.BackEnd.entity.BlogEntity.BlogEntity;
import com.dac.BackEnd.entity.BlogEntity.BlogStatus;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<BlogEntity, Long>{

    @Query(value = "SELECT COUNT(*) FROM blogs", nativeQuery = true)
    int countAllBlogs();

    @Query(value = "SELECT COUNT(*) FROM blogs WHERE status = :status", nativeQuery = true)
    int countAllBlogsByStatus(@Param("status") BlogStatus status);

    @Query("SELECT COUNT(b) FROM BlogEntity b JOIN b.film f JOIN b.insertBy r WHERE b.title LIKE %:searchTerm% OR f.nameFilm LIKE %:searchTerm% OR r.name LIKE %:searchTerm%")
    int countAllBlogsByText(String searchTerm);

    @Query("SELECT COUNT(b) FROM BlogEntity b WHERE b.postTime BETWEEN :startTime AND :endTime")
    int countAllBlogsByPostTime(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    List<BlogEntity> findAllByOrderByInsertDateTimeDesc(Pageable pageable);

    List<BlogEntity> findAllByStatusOrderByInsertDateTimeDesc(BlogStatus status, Pageable pageable);

    @Query("SELECT b FROM BlogEntity b JOIN b.film f JOIN b.insertBy r WHERE b.title LIKE %:searchTerm% OR f.nameFilm LIKE %:searchTerm% OR r.name LIKE %:searchTerm% ORDER BY b.insertDateTime DESC")
    List<BlogEntity> findAllBySearchText(@Param("searchTerm") String searchTerm, Pageable pageable);

    List<BlogEntity> findAllByPostTimeBetween(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

}
