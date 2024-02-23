package com.dac.BackEnd.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.entity.UserEntity.UserRole;
import com.dac.BackEnd.entity.UserEntity.UserStatus;


@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>{

    Optional<UserEntity> findUserByDeleteFlagFalseAndEmail(String username);

    Boolean existsByEmail(String email);

    List<UserEntity> findAllByDeleteFlagFalse();

    long countByRole(UserRole role);

    long countByStatus(UserStatus status);

    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.name LIKE %:searchText%")
    int countByTextInName(@Param("searchText") String searchText);

    @Query("SELECT u FROM UserEntity u WHERE LOWER(u.name) LIKE %:searchText%")
    Page<UserEntity> findByTextInName(String searchText, Pageable pageable);

    List<UserEntity> findAllByStatus(UserStatus status, Pageable pageable);
}