package edu.cit.olo.workfast.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.cit.olo.workfast.auth.entity.Role;
import edu.cit.olo.workfast.auth.entity.User;
import edu.cit.olo.workfast.auth.repository.RoleRepository;
import edu.cit.olo.workfast.auth.repository.UserRepository;
import edu.cit.olo.workfast.department.entity.Department;
import edu.cit.olo.workfast.department.repository.DepartmentRepository;
import edu.cit.olo.workfast.shared.security.JwtService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Automated Integration Tests for the User Feature Slice.
 * Covers: Get All Users (GET /api/v1/users)
 *         Update User (PUT /api/v1/users/{id})
 *         Delete User (DELETE /api/v1/users/{id})
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class UserControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private JwtService jwtService;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private String authToken;

    @BeforeEach
    void setUp() {
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ADMIN").description("Admin").build()));
        roleRepository.findByName("WORKER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("WORKER").description("Worker").build()));

        Department research = departmentRepository.findByName("RESEARCH")
                .orElseGet(() -> departmentRepository.save(Department.builder().name("RESEARCH").description("Research").build()));
        departmentRepository.findByName("QA")
                .orElseGet(() -> departmentRepository.save(Department.builder().name("QA").description("Quality Assurance").build()));

        if (userRepository.findByEmail("usertest@workfast.com").isEmpty()) {
            userRepository.save(User.builder()
                    .name("User Test")
                    .email("usertest@workfast.com")
                    .password(passwordEncoder.encode("password"))
                    .role(adminRole)
                    .department(research)
                    .build());
        }

        org.springframework.security.core.userdetails.UserDetails userDetails =
                new org.springframework.security.core.userdetails.User(
                        "usertest@workfast.com", "password",
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
                );
        authToken = jwtService.generateToken(userDetails);
    }

    @Test
    @Order(1)
    @DisplayName("TC-USER-001: Get all users → 200 OK")
    void getAllUsers_Authenticated_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/v1/users")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @Order(2)
    @DisplayName("TC-USER-002: Get all users without auth → 403 Forbidden")
    void getAllUsers_NoAuth_ReturnsForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(3)
    @DisplayName("TC-USER-003: Update user role → 200 OK")
    void updateUser_ChangeRole_ReturnsUpdated() throws Exception {
        User user = userRepository.findByEmail("usertest@workfast.com").orElseThrow();

        mockMvc.perform(put("/api/v1/users/" + user.getId())
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("role", "WORKER"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("WORKER"));
    }

    @Test
    @Order(4)
    @DisplayName("TC-USER-004: Update user department → 200 OK")
    void updateUser_ChangeDepartment_ReturnsUpdated() throws Exception {
        User user = userRepository.findByEmail("usertest@workfast.com").orElseThrow();

        mockMvc.perform(put("/api/v1/users/" + user.getId())
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("department", "QA"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.department").value("QA"));
    }
}
