package com.example.test1.dto;

import com.example.test1.entities.User;

public class LoginResponse {
    private String token;
    private String role;
    private String errorMessage;
private User user;
    // Private constructor to prevent direct instantiation
    private LoginResponse(String token, String role, User user, String errorMessage )  {
        this.token = token;
        this.role = role;
        this.errorMessage = errorMessage;
        this.user=user;


    }
    public  User getUser() {
        return user;
    }



    // Getters
    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    // Builder class
    public static class Builder {
        private String token;
        private String role;
        private String errorMessage;
        private User user;


        public Builder setUser(User user) {
            this.user = user;
            return this;
        }

        // Setter methods for each field
        public Builder setToken(String token) {
            this.token = token;
            return this;
        }

        public Builder setRole(String role) {
            this.role = role;
            return this;
        }

        public Builder setErrorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        }

        // Method to build the final LoginResponse object
        public LoginResponse build() {
            return new LoginResponse(token, role, user,errorMessage);
        }
    }
}
