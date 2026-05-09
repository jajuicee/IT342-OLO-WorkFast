package edu.cit.olo.workfast.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.cit.olo.workfast.auth.dto.LoginRequest;
import edu.cit.olo.workfast.auth.dto.RegistrationRequest;
import edu.cit.olo.workfast.auth.entity.Role;
import edu.cit.olo.workfast.auth.entity.User;
import edu.cit.olo.workfast.auth.repository.RoleRepository;
import edu.cit.olo.workfast.auth.repository.UserRepository;
import edu.cit.olo.workfast.department.entity.Department;
import edu.cit.olo.workfast.department.repository.DepartmentRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Automated Integration Tests for the Auth Feature Slice.
 * Covers: User Registration (POST /api/v1/auth/register)
 *         User Login (POST /api/v1/auth/login)
 *         Input Validation and Error Handling
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // Ensure required roles and departments exist (DataInitializer may have run)
        if (roleRepository.findByName("WORKER").isEmpty()) {
            roleRepository.save(Role.builder().name("WORKER").description("Standard user").build());
        }
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            roleRepository.save(Role.builder().name("ADMIN").description("Administrator").build());
        }
        if (departmentRepository.findByName("RESEARCH").isEmpty()) {
            departmentRepository.save(Department.builder().name("RESEARCH").description("Research dept").build());
        }
    }

    // ==================== REGISTRATION TESTS ====================

    @Test
    @Order(1)
    @DisplayName("TC-REG-001: Register user with valid data → 201 Created")
    void registerUser_ValidData_ReturnsCreated() throws Exception {
        RegistrationRequest request = new RegistrationRequest();
        request.setName("Test User");
        request.setEmail("testuser@workfast.com");
        request.setPassword("securepassword123");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().string("User registered successfully."));
    }

    @Test
    @Order(2)
    @DisplayName("TC-REG-002: Register with duplicate email → 400 Bad Request")
    void registerUser_DuplicateEmail_ReturnsBadRequest() throws Exception {
        RegistrationRequest request = new RegistrationRequest();
        request.setName("Duplicate User");
        request.setEmail("testuser@workfast.com"); // same email as TC-REG-001
        request.setPassword("password123");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email is already registered."));
    }

    @Test
    @Order(3)
    @DisplayName("TC-REG-003: Register with missing name → 400 Validation Error")
    void registerUser_MissingName_ReturnsValidationError() throws Exception {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("noname@workfast.com");
        request.setPassword("password123");
        // name is intentionally left blank

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(4)
    @DisplayName("TC-REG-004: Register with invalid email format → 400 Validation Error")
    void registerUser_InvalidEmail_ReturnsValidationError() throws Exception {
        RegistrationRequest request = new RegistrationRequest();
        request.setName("Bad Email");
        request.setEmail("not-an-email");
        request.setPassword("password123");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // ==================== LOGIN TESTS ====================

    @Test
    @Order(5)
    @DisplayName("TC-LOGIN-001: Login with valid credentials → 200 OK with JWT token")
    void loginUser_ValidCredentials_ReturnsToken() throws Exception {
        // Ensure user exists with known credentials
        if (userRepository.findByEmail("logintest@workfast.com").isEmpty()) {
            Role workerRole = roleRepository.findByName("WORKER").orElseThrow();
            Department dept = departmentRepository.findByName("RESEARCH").orElseThrow();
            userRepository.save(User.builder()
                    .name("Login Test")
                    .email("logintest@workfast.com")
                    .password(passwordEncoder.encode("testpassword"))
                    .role(workerRole)
                    .department(dept)
                    .build());
        }

        LoginRequest request = new LoginRequest();
        request.setEmail("logintest@workfast.com");
        request.setPassword("testpassword");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.name").value("Login Test"))
                .andExpect(jsonPath("$.email").value("logintest@workfast.com"))
                .andExpect(jsonPath("$.message").value("Login successful!"));
    }

    @Test
    @Order(6)
    @DisplayName("TC-LOGIN-002: Login with invalid password → 401 Unauthorized")
    void loginUser_InvalidPassword_ReturnsUnauthorized() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("logintest@workfast.com");
        request.setPassword("wrongpassword");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(7)
    @DisplayName("TC-LOGIN-003: Login with non-existent email → 401 Unauthorized")
    void loginUser_NonExistentEmail_ReturnsUnauthorized() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("nonexistent@workfast.com");
        request.setPassword("password123");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}
