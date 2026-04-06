package edu.cit.olo.workfast.service;

import edu.cit.olo.workfast.dto.RegistrationRequest;
import edu.cit.olo.workfast.entity.Department;
import edu.cit.olo.workfast.entity.Role;
import edu.cit.olo.workfast.entity.User;
import edu.cit.olo.workfast.repository.DepartmentRepository;
import edu.cit.olo.workfast.repository.RoleRepository;
import edu.cit.olo.workfast.repository.UserRepository;
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

        // Fetch default role (WORKER) and department (RESEARCH)
        Role defaultRole = roleRepository.findByName("WORKER")
                .orElseThrow(() -> new RuntimeException("Default role WORKER not found"));
        
        Department defaultDepartment = departmentRepository.findByName("RESEARCH")
                .orElseThrow(() -> new RuntimeException("Default department RESEARCH not found"));

        User newUser = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(defaultRole)
                .department(defaultDepartment)
                .build();

        return userRepository.save(newUser);
    }
}