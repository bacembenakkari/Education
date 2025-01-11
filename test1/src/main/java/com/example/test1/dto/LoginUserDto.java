package com.example.test1.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


public class LoginUserDto {
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    public LoginUserDto(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public @Email(message = "Invalid email format") @NotBlank(message = "Email is required") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "Invalid email format") @NotBlank(message = "Email is required") String email) {
        this.email = email;
    }

    public @NotBlank(message = "Password is required") String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "Password is required") String password) {
        this.password = password;
    }

    @NotBlank(message = "Password is required")
    private String password;
}