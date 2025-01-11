package com.example.test1.service;

import com.example.test1.entities.Course;
import com.example.test1.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class CourseService implements IServiceCourse {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public Course updateCourse(Long id, Course updatedCourse) {
        Optional<Course> existingCourseOpt = courseRepository.findById(id);

        if (existingCourseOpt.isPresent()) {
            Course existingCourse = existingCourseOpt.get();
            existingCourse.setTitle(updatedCourse.getTitle());
            existingCourse.setDescription(updatedCourse.getDescription());
            existingCourse.setDuration(updatedCourse.getDuration()); // Update duration
            existingCourse.setTeacherName(updatedCourse.getTeacherName()); // Update teacher name
            existingCourse.setPrice(updatedCourse.getPrice()); // Update price
            return courseRepository.save(existingCourse);
        } else {
            throw new RuntimeException("Course with ID " + id + " not found");
        }
    }

    @Override
    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course with ID " + id + " not found"));
    }

    @Override
    public Set<Course> getAllCourses() {
        return new HashSet<>(courseRepository.findAll());
    }

    @Override
    public Set<Course> searchCourse(String searchTerm) {
        return courseRepository.findByTitleContainingOrDescriptionContaining(searchTerm);
    }

    @Override
    public void deleteCourse(Long id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
        } else {
            throw new RuntimeException("Course with ID " + id + " not found");
        }
    }
}
