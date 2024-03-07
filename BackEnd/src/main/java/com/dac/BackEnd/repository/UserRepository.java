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

    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.role = UserRole.ROLE_REVIEWER AND u.deleteFlag = false")
    long countAllReviewer();

    Optional<UserEntity> findByEmailAndDeleteFlagFalse(String email);

    Optional<UserEntity> findByEmailAndRole(String email, UserRole role);

    Optional<UserEntity> findByEmail(String email);

    @Query("SELECT u FROM UserEntity u " +
            "WHERE ((:status IS NULL) OR (u.status = :status)) " +
            "AND (LOWER(u.name) LIKE LOWER(CONCAT('%', COALESCE(:searchText, ''), '%')) " +
            "OR LOWER(u.phone) LIKE LOWER(CONCAT('%', COALESCE(:searchText, ''), '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', COALESCE(:searchText, ''), '%'))) " +
            "AND u.deleteFlag = false ORDER BY u.insertDateTime DESC")
    Page<UserEntity> findAllReviewers(
            @Param("status") UserStatus status,
            @Param("searchText") String searchText,
            Pageable pageable);
}