package com.example.test1.auth;

import com.example.test1.Jwt.JwtService;
import com.example.test1.dto.LoginUserDto;
import com.example.test1.dto.RegisterUserDto;
import com.example.test1.entities.Roles;
import com.example.test1.entities.User;
import com.example.test1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Autowired
    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User signup(RegisterUserDto input) {
        // Determine role based on input
        Roles selectedRole = Roles.valueOf(input.getRole().toUpperCase()); // Get role dynamically

        // Create a new user and set fields
        User user = new User();
        user.setEmail(input.getEmail());
        user.setFirstName(input.getFullName());
        user.setPassword(passwordEncoder.encode(input.getPassword()));
        user.setCreatedAt(new Date());
        user.setRole(selectedRole); // Set the role dynamically

        // Save the user and return
        return userRepository.save(user);
    }

    public User authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Method to check if a user has admin rights
    public boolean isAdmin(User user) {
        return user.getRole() != null && Roles.INSTRUCTOR.name().equals(user.getRole().name());
    }
}
