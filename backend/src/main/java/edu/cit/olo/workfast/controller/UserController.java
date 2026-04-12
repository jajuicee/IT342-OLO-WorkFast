package edu.cit.olo.workfast.controller;

import edu.cit.olo.workfast.entity.Department;
import edu.cit.olo.workfast.entity.Role;
import edu.cit.olo.workfast.entity.User;
import edu.cit.olo.workfast.repository.DepartmentRepository;
import edu.cit.olo.workfast.repository.RoleRepository;
import edu.cit.olo.workfast.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @RequestBody Map<String, String> updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("role")) {
            Role role = roleRepository.findByName(updates.get("role"))
                    .orElseThrow(() -> new RuntimeException("Role not found: " + updates.get("role")));
            user.setRole(role);
        }

        if (updates.containsKey("department")) {
            Department dept = departmentRepository.findByName(updates.get("department"))
                    .orElseThrow(() -> new RuntimeException("Department not found: " + updates.get("department")));
            user.setDepartment(dept);
        }

        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}