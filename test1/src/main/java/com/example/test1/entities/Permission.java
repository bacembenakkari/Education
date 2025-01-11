package com.example.test1.entities;

public enum Permission {
    STUDENT_READ("student:read"),
    STUDENT_CREATE("student:create"),
    INSTRUCTOR_READ("instructor:read"),
    INSTRUCTOR_CREATE("instructor:create"),
    INSTRUCTOR_UPDATE("instructor:update"),
    INSTRUCTOR_DELETE("instructor:delete");

    private final String permission;

    Permission(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }
}