package com.example.test1.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.test1.entities.User;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    List<User> findAll();
}