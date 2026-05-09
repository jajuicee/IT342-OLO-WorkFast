package edu.cit.olo.workfast.project;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.cit.olo.workfast.auth.entity.Role;
import edu.cit.olo.workfast.auth.entity.User;
import edu.cit.olo.workfast.auth.repository.RoleRepository;
import edu.cit.olo.workfast.auth.repository.UserRepository;
import edu.cit.olo.workfast.department.entity.Department;
import edu.cit.olo.workfast.department.repository.DepartmentRepository;
import edu.cit.olo.workfast.project.dto.ProjectRequestDTO;
import edu.cit.olo.workfast.shared.security.JwtService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Automated Integration Tests for the Project Feature Slice.
 * Covers: Create Project (POST /api/v1/projects)
 *         Get All Projects (GET /api/v1/projects)
 *         Get Project Tasks (GET /api/v1/projects/{id}/tasks)
 *         Update Task Status (PUT /api/v1/projects/{id}/tasks/{id})
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ProjectControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private JwtService jwtService;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private String adminToken;

    @BeforeEach
    void setUp() {
        // Ensure roles
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ADMIN").description("Admin").build()));
        roleRepository.findByName("WORKER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("WORKER").description("Worker").build()));

        // Ensure departments
        Department research = departmentRepository.findByName("RESEARCH")
                .orElseGet(() -> departmentRepository.save(Department.builder().name("RESEARCH").description("Research").build()));
        departmentRepository.findByName("DESIGN")
                .orElseGet(() -> departmentRepository.save(Department.builder().name("DESIGN").description("Design").build()));
        departmentRepository.findByName("DEVELOPMENT")
                .orElseGet(() -> departmentRepository.save(Department.builder().name("DEVELOPMENT").description("Dev").build()));

        // Ensure admin user
        if (userRepository.findByEmail("admin@workfast.com").isEmpty()) {
            userRepository.save(User.builder()
                    .name("Admin User")
                    .email("admin@workfast.com")
                    .password(passwordEncoder.encode("adminpass"))
                    .role(adminRole)
                    .department(research)
                    .build());
        }

        // Generate JWT for admin
        org.springframework.security.core.userdetails.UserDetails userDetails =
                new org.springframework.security.core.userdetails.User(
                        "admin@workfast.com", "adminpass",
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
                );
        adminToken = jwtService.generateToken(userDetails);
    }

    @Test
    @Order(1)
    @DisplayName("TC-PROJ-001: Create project with valid data → 200 OK")
    void createProject_ValidData_ReturnsOk() throws Exception {
        Department research = departmentRepository.findByName("RESEARCH").orElseThrow();
        Department design = departmentRepository.findByName("DESIGN").orElseThrow();
        Department dev = departmentRepository.findByName("DEVELOPMENT").orElseThrow();

        ProjectRequestDTO request = new ProjectRequestDTO();
        request.setName("Test Pipeline Project");
        request.setDescription("A project to test the vertical slice pipeline");
        request.setDepositAmount(new BigDecimal("5000.00"));
        request.setDepartmentSequence(List.of(research.getId(), design.getId(), dev.getId()));

        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Pipeline Project"))
                .andExpect(jsonPath("$.status").value("INITIATED"));
    }

    @Test
    @Order(2)
    @DisplayName("TC-PROJ-002: Get all projects → 200 OK with list")
    void getAllProjects_Authenticated_ReturnsList() throws Exception {
        mockMvc.perform(get("/api/v1/projects")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @Order(3)
    @DisplayName("TC-PROJ-003: Get projects without authentication → 401/403")
    void getAllProjects_NoAuth_ReturnsForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/projects"))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(4)
    @DisplayName("TC-PROJ-004: Get project tasks → 200 OK with task list")
    void getProjectTasks_ValidProject_ReturnsTasks() throws Exception {
        // First get a project
        MvcResult result = mockMvc.perform(get("/api/v1/projects")
                        .header("Authorization", "Bearer " + adminToken))
                .andReturn();

        String body = result.getResponse().getContentAsString();
        // If projects exist, query the first one's tasks
        if (body.length() > 2) { // not empty array "[]"
            String projectId = objectMapper.readTree(body).get(0).get("id").asText();
            mockMvc.perform(get("/api/v1/projects/" + projectId + "/tasks")
                            .header("Authorization", "Bearer " + adminToken))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray());
        }
    }
}
