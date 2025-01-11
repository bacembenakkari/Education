package com.example.test1.controller;

import com.example.test1.entities.Course;
import com.example.test1.entities.User;
import com.example.test1.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")

@Controller
@RequestMapping("/res/users")
public class ResUserController {

    private final UserService userService;

    public ResUserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/users")
    public String listUsers(Model model) {
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        return "list";  // Return the list view
    }

    @GetMapping("/add")
    public String showCreateUserForm(Model model) {
        model.addAttribute("user", new User());
        return "user/add"; // Return the user creation form
    }

    @PostMapping("/add")
    public String saveUser(@ModelAttribute User user) {
        userService.saveUser(user);
        return "redirect:/res/users/list"; // Redirect to the user list after saving
    }

    @GetMapping("/enroll/{courseId}")
    public String enrollInCourse(@PathVariable Long courseId, Model model) {
        Long userId = 1L; // Example userId, you might want to fetch the logged-in user
        Course course = userService.enrollUserInCourse(userId, courseId);
        return "user/enroll"; // Return the enrollment confirmation page
    }
}
