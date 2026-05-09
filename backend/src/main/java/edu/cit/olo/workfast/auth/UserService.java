package edu.cit.olo.workfast.auth;

import edu.cit.olo.workfast.auth.dto.RegistrationRequest;
import edu.cit.olo.workfast.auth.entity.Role;
import edu.cit.olo.workfast.auth.entity.User;
import edu.cit.olo.workfast.auth.repository.RoleRepository;
import edu.cit.olo.workfast.auth.repository.UserRepository;
import edu.cit.olo.workfast.department.entity.Department;
import edu.cit.olo.workfast.department.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        // Fetch specified role/department or fallback to defaults
        String roleName = request.getRole() != null ? request.getRole() : "WORKER";
        String deptName = request.getDepartment() != null ? request.getDepartment() : "RESEARCH";

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role " + roleName + " not found"));
        
        Department department = departmentRepository.findByName(deptName)
                .orElseThrow(() -> new RuntimeException("Department " + deptName + " not found"));

        User newUser = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .department(department)
                .build();

        return userRepository.save(newUser);
    }
}
