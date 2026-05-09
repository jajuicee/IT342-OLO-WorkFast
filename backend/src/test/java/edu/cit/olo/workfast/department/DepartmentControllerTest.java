package edu.cit.olo.workfast.department;

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
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Collections;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class DepartmentControllerTest {

    @Autowired private MockMvc mockMvc;
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
        Department research = departmentRepository.findByName("RESEARCH")
                .orElseGet(() -> departmentRepository.save(Department.builder().name("RESEARCH").description("Research").build()));
        if (userRepository.findByEmail("depttest@workfast.com").isEmpty()) {
            userRepository.save(User.builder().name("Dept Test").email("depttest@workfast.com")
                    .password(passwordEncoder.encode("password")).role(adminRole).department(research).build());
        }
        org.springframework.security.core.userdetails.UserDetails ud =
                new org.springframework.security.core.userdetails.User("depttest@workfast.com", "password",
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
        authToken = jwtService.generateToken(ud);
    }

    @Test @Order(1)
    @DisplayName("TC-DEPT-001: Get all departments -> 200 OK")
    void getAllDepartments_Authenticated_ReturnsList() throws Exception {
        mockMvc.perform(get("/api/v1/departments").header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk()).andExpect(jsonPath("$").isArray());
    }

    @Test @Order(2)
    @DisplayName("TC-DEPT-002: Get departments no auth -> 403")
    void getAllDepartments_NoAuth_ReturnsForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/departments")).andExpect(status().isForbidden());
    }
}
