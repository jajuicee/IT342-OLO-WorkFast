package edu.cit.olo.workfast.controller;

import edu.cit.olo.workfast.entity.Project;
import edu.cit.olo.workfast.entity.Task;
import edu.cit.olo.workfast.entity.User;
import edu.cit.olo.workfast.repository.TaskRepository;
import edu.cit.olo.workfast.repository.UserRepository;
import edu.cit.olo.workfast.service.ProjectService;
import edu.cit.olo.workfast.pattern.facade.ProjectFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectFacade projectFacade;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @PostMapping("/projects")
    // Use @PreAuthorize handle roles if @EnableMethodSecurity is on, but SecurityConfig has hasRole("ADMIN")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByEmail(email).orElseThrow();
        
        // Facade Pattern: Unified subsystem call
        Project createdProject = projectFacade.initiateNewProject(project, admin);
        return ResponseEntity.ok(createdProject);
    }

    @PutMapping("/projects/{projectId}/tasks/{taskId}")
    public ResponseEntity<String> updateTaskStatus(
            @PathVariable UUID projectId,
            @PathVariable UUID taskId,
            @RequestParam Task.TaskStatus status
    ) {
        // Business logic check: Ensure task belongs to the project
        Task task = taskRepository.findById(taskId).orElseThrow();
        if (!task.getProject().getId().equals(projectId)) {
            return ResponseEntity.badRequest().body("Task does not belong to this project.");
        }

        projectService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok("Task status updated.");
    }

    @GetMapping("/departments/{departmentId}/tasks")
    public ResponseEntity<List<Task>> getDepartmentTasks(
            @PathVariable Long departmentId,
            @RequestParam(defaultValue = "UNLOCKED") Task.TaskStatus status
    ) {
        List<Task> tasks = taskRepository.findByDepartmentIdAndStatus(departmentId, status);
        return ResponseEntity.ok(tasks);
    }
}
