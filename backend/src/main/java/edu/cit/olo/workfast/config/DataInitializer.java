package edu.cit.olo.workfast.config;

import edu.cit.olo.workfast.entity.Department;
import edu.cit.olo.workfast.entity.Role;
import edu.cit.olo.workfast.entity.User;
import edu.cit.olo.workfast.repository.DepartmentRepository;
import edu.cit.olo.workfast.repository.RoleRepository;
import edu.cit.olo.workfast.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("[DataInitializer] Seeding initial data...");

        // 1. Roles
        Role adminRole = createRoleIfNotFound("ADMIN", "System Administrator with full access");
        Role workerRole = createRoleIfNotFound("WORKER", "Standard user with basic access");

        // 2. Departments
        Department research = createDepartmentIfNotFound("RESEARCH", "Research and scientific analysis");
        createDepartmentIfNotFound("DEVELOPMENT", "Software engineering and coding");
        createDepartmentIfNotFound("QA", "Quality assurance and testing");
        createDepartmentIfNotFound("DEPLOYMENT", "Final production rollout");

        // 3. Test User (test3@gmail.com / 12345678)
        if (!userRepository.existsByEmail("test3@gmail.com")) {
            log.info("[DataInitializer] Creating test user: test3@gmail.com");
            User testUser = User.builder()
                    .name("Test User")
                    .email("test3@gmail.com")
                    .password(passwordEncoder.encode("12345678"))
                    .role(adminRole)
                    .department(research)
                    .build();
            userRepository.save(testUser);
        }

        log.info("[DataInitializer] Seeding completed.");
    }

    private Role createRoleIfNotFound(String name, String description) {
        return roleRepository.findByName(name).orElseGet(() -> {
            log.info("[DataInitializer] Creating role: {}", name);
            Role role = Role.builder()
                    .name(name)
                    .description(description)
                    .build();
            return roleRepository.save(role);
        });
    }

    private Department createDepartmentIfNotFound(String name, String description) {
        return departmentRepository.findByName(name).orElseGet(() -> {
            log.info("[DataInitializer] Creating department: {}", name);
            Department dept = Department.builder()
                    .name(name)
                    .description(description)
                    .build();
            return departmentRepository.save(dept);
        });
    }
}
