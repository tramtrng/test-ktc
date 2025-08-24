package com.example.spring_project.dto;

import com.example.spring_project.entities.Gender;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

@Data
public class EmployeeCreateRequest {
    @NotBlank(message = "Họ tên không được để trống")
    @Size(min = 4, max = 160, message = "Họ tên phải từ 4 đến 160 ký tự")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    private LocalDate dateOfBirth;
    private Gender gender;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^\\d{10}$", message = "Số điện thoại phải đủ 10 số")
    private String phoneNumber;

    private Boolean active;

    @NotBlank(message = "Password không được để trống")
    private String password;
}
