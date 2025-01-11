package com.example.test1.auth;

import com.example.test1.Jwt.JwtService;
import com.example.test1.dto.LoginResponse;
import com.example.test1.dto.LoginUserDto;
import com.example.test1.dto.RegisterUserDto;
import com.example.test1.entities.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;

    public AuthenticationController(
            AuthenticationService authenticationService,
            JwtService jwtService
    ) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody RegisterUserDto registerUserDto) {
        try {
            // Register the user
            User registeredUser = authenticationService.signup(registerUserDto);

            // Generate JWT token
            String token = jwtService.generateToken((UserDetails) registeredUser);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("user", registeredUser);
            response.put("token", token);
            response.put("role", registeredUser.getRole().name());  // Ensure role is returned as string

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Registration failed", "message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginUserDto loginUserDto) {
        try {
            // Authenticate user
            User authenticatedUser = authenticationService.authenticate(loginUserDto);
System.out.println("gd"+authenticatedUser.getId());
            // Create UserDetails (Optional, if necessary for specific user details management)
            UserDetails userDetails = (UserDetails) authenticatedUser;

            // Generate JWT token
            String token = jwtService.generateToken(userDetails);


            // Prepare login response
            LoginResponse loginResponse = new LoginResponse.Builder()
                    .setToken(token)
                    .setRole(authenticatedUser.getRole().name())
                    .setUser(authenticatedUser)
                    .setErrorMessage(null)  // Optional field, can be null if no error
                    .build();

            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse.Builder()
                            .setErrorMessage("Login failed: " + e.getMessage())
                            .build());
        }
    }
}
