package com.example.spring_project.dto;

import com.example.spring_project.entities.Gender;
import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Data
public class EmployeeUpdateRequest {

    @NotBlank(message = "Họ tên không được để trống")
    @Size(min=4, max=100, message = "Họ tên phải từ 4 đến 100 ký tự")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "\\d{10}$", message = "Số điện thoại phải đủ 10 số")
    private String phoneNumber;

    private Gender gender;

    private Boolean active;

    @NotNull(message = "Ngày sinh không được để trống")
    private LocalDate dateOfBirth;

    @NotNull(message = "Password không được để trống")
    private String password;

}
