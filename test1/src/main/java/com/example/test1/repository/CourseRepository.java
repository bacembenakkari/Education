package com.example.test1.repository;

import com.example.test1.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("SELECT c FROM Course c WHERE c.title LIKE %:searchTerm% OR c.description LIKE %:searchTerm%")
    Set<Course> findByTitleContainingOrDescriptionContaining(@Param("searchTerm") String searchTerm);

}
