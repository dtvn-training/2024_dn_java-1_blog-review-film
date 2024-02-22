package com.dac.BackEnd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dac.BackEnd.entity.ContentEntity;

@Repository
public interface ContentRepository extends JpaRepository<ContentEntity, Long>{
    
}
