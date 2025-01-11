package com.example.test1.controller;

import com.example.test1.entities.Course;
import com.example.test1.entities.User;
import com.example.test1.service.CourseService;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000/admins", allowCredentials = "true")

public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // Only instructors can create courses
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('instructor:create')")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
    }

    // Both students and instructors can get course by id
    @GetMapping("/get/{id}")
    @PreAuthorize("hasAnyAuthority('student:read', 'instructor:read')")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        return new ResponseEntity<>(course, HttpStatus.OK);
    }

    // Both students and instructors can get all courses

    @GetMapping("/getcourses")
//    @PreAuthorize("hasAnyAuthority('student:read', 'instructor:read')")
    public ResponseEntity<Set<Course>> getAllCourses() {
        Set<Course> courses = courseService.getAllCourses();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    // Only instructors can update courses
    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('instructor:update')")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course updatedCourse) {
        Course course = courseService.updateCourse(id, updatedCourse);
        return new ResponseEntity<>(course, HttpStatus.OK);
    }

    // Only instructors can delete courses
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('instructor:delete')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Both students and instructors can search courses
    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('student:read', 'instructor:read')")
    public ResponseEntity<Set<Course>> searchCourse(@RequestParam String searchTerm) {
        Set<Course> courses = courseService.searchCourse(searchTerm);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }
}