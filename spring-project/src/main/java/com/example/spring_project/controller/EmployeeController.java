package com.example.spring_project.controller;

import com.example.spring_project.dto.EmployeeCreateRequest;
import com.example.spring_project.dto.EmployeeDTO;
import com.example.spring_project.entities.Employee;
import com.example.spring_project.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    private EmployeeDTO toDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
    dto.setFullName(employee.getFullName());
        dto.setEmail(employee.getEmail());
    dto.setDateOfBirth(employee.getDateOfBirth());
        dto.setGender(employee.getGender());
    dto.setPhoneNumber(employee.getPhoneNumber());
        dto.setActive(employee.getActive());
    dto.setCreatedAt(employee.getCreatedAt());
    dto.setUpdatedAt(employee.getUpdatedAt());
        return dto;
    }

    @PostMapping
    public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody EmployeeCreateRequest request) {
        Employee employee = new Employee();
    employee.setFullName(request.getFullName());
        employee.setEmail(request.getEmail());
    employee.setDateOfBirth(request.getDateOfBirth());
        employee.setGender(request.getGender());
    employee.setPhoneNumber(request.getPhoneNumber());
        employee.setActive(request.getActive());
    employee.setHashedPassword(request.getPassword());
    employee.setCreatedAt(java.time.LocalDateTime.now());
    employee.setUpdatedAt(java.time.LocalDateTime.now());
        Employee saved = employeeService.saveEmployee(employee);
        return ResponseEntity.ok(toDTO(saved));
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        List<EmployeeDTO> dtos = employeeService.getAllEmployees().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employeeOpt = employeeService.getEmployeeById(id);
        if (employeeOpt.isPresent()) {
            return ResponseEntity.ok(toDTO(employeeOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable Long id, @RequestBody EmployeeCreateRequest request) {
        Optional<Employee> employeeOpt = employeeService.getEmployeeById(id);
        if (employeeOpt.isPresent()) {
            Employee employee = employeeOpt.get();
            employee.setFullName(request.getFullName());
            employee.setDateOfBirth(request.getDateOfBirth());
            employee.setGender(request.getGender());
            employee.setPhoneNumber(request.getPhoneNumber());
            employee.setActive(request.getActive());
            employee.setUpdatedAt(java.time.LocalDateTime.now());
            Employee updated = employeeService.updateEmployee(employee);
            return ResponseEntity.ok(toDTO(updated));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}