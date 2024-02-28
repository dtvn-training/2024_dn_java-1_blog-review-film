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

    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.role = UserRole.ROLE_REVIEWER AND u.status = :status AND u.deleteFlag = false")
    long countReviewerByStatus(@Param("status") UserStatus status);

    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.role = UserRole.ROLE_REVIEWER AND u.name LIKE %:searchText%  AND u.deleteFlag = false")
    int countReviewerByTextInName(@Param("searchText") String searchText);

    long countByRole(UserRole role);

    @Query("SELECT u FROM UserEntity u WHERE u.role = UserRole.ROLE_REVIEWER AND u.deleteFlag = false")
    List<UserEntity> findAllReviewer(Pageable pageable);

    @Query("SELECT u FROM UserEntity u WHERE u.role = UserRole.ROLE_REVIEWER AND u.status = :status AND u.deleteFlag = false")
    List<UserEntity> findAllReviewersByStatus(@Param("status") UserStatus status, Pageable pageable);

    @Query("SELECT u FROM UserEntity u WHERE u.role = UserRole.ROLE_REVIEWER AND LOWER(u.name) LIKE %:searchText% AND u.deleteFlag = false")
    Page<UserEntity> findReviewerByTextInName(String searchText, Pageable pageable);

    Optional<UserEntity> findByEmailAndRole(String email, UserRole role);
}