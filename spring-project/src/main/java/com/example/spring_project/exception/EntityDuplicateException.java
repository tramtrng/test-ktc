package com.example.spring_project.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class EntityDuplicateException extends RuntimeException {

    private final HttpStatus status;

    public EntityDuplicateException(String entityName) {
        super(entityName + " duplicate in the system");
        this.status = HttpStatus.CONFLICT;
    }
}