package com.education.app.repository;

import com.education.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    List<User> findByIsActiveTrue();

    boolean existsByEmail(String email);

    List<User> findByFirstNameContainingIgnoreCase(String firstName);
}
