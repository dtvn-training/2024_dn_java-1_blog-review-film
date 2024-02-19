package com.dac.BackEnd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dac.BackEnd.entity.BlogEntity.BlogEntity;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<BlogEntity, Long>{

    @Query(value = "SELECT COUNT(*) FROM blogs", nativeQuery = true)
    int countAllBlogs();

    @Query(value = "SELECT * FROM blogs ORDER BY insert_date_time DESC LIMIT 10 OFFSET :pageNumber", nativeQuery = true)
    List<BlogEntity> findAllBlogsPerPage(@Param("pageNumber") int pageNumber);
}
