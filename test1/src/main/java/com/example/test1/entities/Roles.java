package com.example.test1.entities;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public enum Roles {
    STUDENT(Set.of(
            Permission.STUDENT_READ,
            Permission.STUDENT_CREATE
    )),
    INSTRUCTOR(Set.of(
            Permission.INSTRUCTOR_READ,
            Permission.INSTRUCTOR_CREATE,
            Permission.INSTRUCTOR_UPDATE,
            Permission.INSTRUCTOR_DELETE
    ));

    private final Set<Permission> permissions;

    Roles(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
