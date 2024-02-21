package com.dac.BackEnd.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dac.BackEnd.entity.UserEntity.UserEntity;
import com.dac.BackEnd.entity.UserEntity.UserRole;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>{
    // Tim kiem user co ton tai trong db k
    Optional<UserEntity> findUserByDeleteFlagFalseAndEmail(String username);
    // Email da co trong db chua
    Boolean existsByEmailAndDeleteFlagIsFalse(String username);

    // List<UserEntity> findByRoleAndDeletedIsFalse(UserRole role);
    List<UserEntity> findAllByDeleteFlagFalse();
    // Optional<UserEntity> findUserByDeletedFalseAndId(Long id);

    long countByRole(UserRole role);
}