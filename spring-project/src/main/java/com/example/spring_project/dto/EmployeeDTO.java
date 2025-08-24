package com.example.spring_project.dto;

import com.example.spring_project.entities.Gender;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EmployeeDTO {
    private Long id;
    private String fullName;
    private String email;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String phoneNumber;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}