package com.example.test1.controller;

import com.example.test1.entities.Course;
import com.example.test1.service.CourseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;
@CrossOrigin(origins = "http://localhost:3000/admins", allowCredentials = "true")
@Controller
@RequestMapping("/res/courses")
public class ResCourseController {
    private static final Logger logger = LoggerFactory.getLogger(ResCourseController.class); // Logger initialization
    private final CourseService courseService;

    public ResCourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/index")
    public String getAllCourses(Model model) {
        Set<Course> courses = courseService.getAllCourses();
        model.addAttribute("courses", courses != null ? courses : new HashSet<>());
        return "index"; // Corresponding Thymeleaf template
    }

    @GetMapping("/search")
    public String searchCourse(@RequestParam String searchTerm, Model model) {
        logger.info("Searching for courses with term: " + searchTerm);
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            model.addAttribute("courses", new HashSet<>());
            return "home";
        }
        Set<Course> courses = courseService.searchCourse(searchTerm.trim());
        model.addAttribute("courses", courses);
        return "home";
    }




    @GetMapping("/details/{id}")
    public String getCourseById(@PathVariable Long id, Model model) {
        Course course = courseService.getCourseById(id);
        if (course == null) {
            logger.warn("Course not found with id: " + id);
            return "error"; // Redirect to an error page or handle appropriately
        }
        model.addAttribute("course", course);
        return "detailcourse";
    }

    @GetMapping("/add")
    public String showCreateCourseForm(Model model) {
        model.addAttribute("course", new Course());
        return "add-course"; // Updated to match the Thymeleaf template name
    }

    @PostMapping("/create")
    public String createCourse(@ModelAttribute Course course) {
        if (course.getTitle() == null || course.getDescription() == null ||
                course.getDuration() == null || course.getTeacherName() == null ||
                course.getPrice() == null) {
            logger.warn("Invalid course data: " + course);
            return "redirect:/res/courses/add"; // Redirect back to add form if validation fails
        }
        courseService.createCourse(course);
        return "redirect:/res/courses/list";
    }

    @GetMapping("/edit/{id}")
    public String showEditCourseForm(@PathVariable Long id, Model model) {
        Course course = courseService.getCourseById(id);
        if (course == null) {
            logger.warn("Course not found with id: " + id);
            return "error"; // Redirect to an error page or handle appropriately
        }
        model.addAttribute("course", course);
        return "edit-course";
    }

    @PostMapping("/update/{id}")
    public String updateCourse(@PathVariable Long id, @ModelAttribute Course updatedCourse) {
        if (updatedCourse.getTitle() == null || updatedCourse.getDescription() == null ||
                updatedCourse.getDuration() == null || updatedCourse.getTeacherName() == null ||
                updatedCourse.getPrice() == null) {
            logger.warn("Invalid updated course data: " + updatedCourse);
            return "redirect:/res/courses/edit/" + id; // Redirect back to edit form if validation fails
        }
        courseService.updateCourse(id, updatedCourse);
        return "redirect:/res/courses/list";
    }

    @GetMapping("/delete/{id}")
    public String deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return "redirect:/res/courses/list";
    }
}
