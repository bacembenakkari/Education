package com.example.test1.controller;

import com.example.test1.Jwt.JwtService;
import com.example.test1.entities.Course;
import com.example.test1.entities.User;
import com.example.test1.entities.Roles;
import com.example.test1.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {
    private JwtService jwtService;
    private final UserService userService;

    public UserController(UserService userService ,JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // Only instructors can view all users
    @GetMapping("/getusers")
    @PreAuthorize("hasAuthority('instructor:read')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Only students can enroll in courses
    @PostMapping("/{userId}/enroll/{courseId}")
    @PreAuthorize("hasAuthority('student:create')")
    public ResponseEntity<?> enrollInCourse(
            @PathVariable Long userId, @PathVariable Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();


        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.badRequest().body("You can only enroll yourself in courses");
        }

        if (currentUser.getRole() != Roles.STUDENT) {
            return ResponseEntity.badRequest().body("Only students can enroll in courses");
        }

        Course course = userService.enrollUserInCourse(userId, courseId);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/{userId}/enrolled-courses")
    @PreAuthorize("hasAuthority('student:read')")
    public ResponseEntity<List<Course>> getEnrolledCourses(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.badRequest().body(null);
        }

        List<Course> enrolledCourses = userService.getEnrolledCourses(userId);
        return ResponseEntity.ok(enrolledCourses);
    }

    // Only instructors can create new users
    @PostMapping("/save")
    @PreAuthorize("hasAuthority('instructor:create')")
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }
}
