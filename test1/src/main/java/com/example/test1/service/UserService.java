    package com.example.test1.service;

    import com.example.test1.entities.User;
    import com.example.test1.entities.Course;
    import com.example.test1.entities.Roles;
    import com.example.test1.exception.ResourceNotFoundException;
    import com.example.test1.exception.BadRequestException;
    import com.example.test1.repository.UserRepository;
    import com.example.test1.repository.CourseRepository;
    import com.fasterxml.jackson.annotation.JsonIgnore;
    import jakarta.transaction.Transactional;
    import org.springframework.stereotype.Service;

    import java.util.ArrayList;
    import java.util.List;

    @Service
    public class UserService {

        private final UserRepository userRepository;
        private final CourseRepository courseRepository;

        public UserService(UserRepository userRepository, CourseRepository courseRepository) {
            this.userRepository = userRepository;
            this.courseRepository = courseRepository;
        }

        public List<User> getAllUsers() {
            return userRepository.findAll();
        }
        @JsonIgnore
        public Course enrollUserInCourse(Long userId, Long courseId) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            if (user.getRole() != Roles.STUDENT) {
                throw new BadRequestException("Only students can enroll in courses");
            }

            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

            // Check if user is already enrolled
            if (user.getCourses().contains(course)) {
                throw new BadRequestException("User is already enrolled in this course");
            }

            course.getUsers().add(user);

            // Save both entities
            courseRepository.save(course);
            return course;
        }

        public User saveUser(User user) {
            // Add any validation logic here
            return userRepository.save(user);
        }

        public User getUserById(Long id) {
            return userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        }
        public List<Course> getEnrolledCourses(Long userId) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            return new ArrayList<>(user.getCourses()); // Convert Set to List
        }



    }