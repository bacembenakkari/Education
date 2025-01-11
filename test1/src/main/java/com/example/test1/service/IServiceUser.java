package com.example.test1.service;

import com.example.test1.entities.Course;
import com.example.test1.entities.User;

import java.util.List;

public interface IServiceUser{
    List<User> getAllUsers(); // Method to fetch all users
    User enrollUserInCourse(Long userId, Long courseId); // Method to enroll user in a course
    User saveUser(User user);
    List<Course> getEnrolledCourses(Long userId);}
