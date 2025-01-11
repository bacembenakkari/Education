package com.example.test1.service;

import com.example.test1.entities.Course;

import java.util.Optional;
import java.util.Set;

public interface IServiceCourse  {

    Course createCourse(Course course);

    Course updateCourse(Long id, Course updatedCourse);

    Course getCourseById(Long id);

    Set<Course> getAllCourses();

    Set<Course> searchCourse(String searchTerm);
    void deleteCourse(Long id);
   // Optional<Course> findById(Long id);
}

