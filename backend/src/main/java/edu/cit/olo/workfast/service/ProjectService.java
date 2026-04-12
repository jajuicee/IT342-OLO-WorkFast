package edu.cit.olo.workfast.service;

import edu.cit.olo.workfast.entity.Department;
import edu.cit.olo.workfast.entity.Project;
import edu.cit.olo.workfast.entity.Task;
import edu.cit.olo.workfast.entity.User;
import edu.cit.olo.workfast.repository.DepartmentRepository;
import edu.cit.olo.workfast.repository.ProjectRepository;
import edu.cit.olo.workfast.repository.TaskRepository;
import edu.cit.olo.workfast.pattern.observer.TaskObserver;
import edu.cit.olo.workfast.pattern.observer.WebSocketTaskNotifier;
import edu.cit.olo.workfast.pattern.strategy.TaskAssignmentStrategy;
import edu.cit.olo.workfast.pattern.strategy.RoundRobinAssignmentStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final DepartmentRepository departmentRepository;

    // Pattern References
    private final TaskObserver taskNotifier;
    private final TaskAssignmentStrategy assignmentStrategy;

    public ProjectService(ProjectRepository projectRepository, 
                          TaskRepository taskRepository, 
                          DepartmentRepository departmentRepository, 
                          TaskObserver taskNotifier, 
                          TaskAssignmentStrategy assignmentStrategy) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.departmentRepository = departmentRepository;
        this.taskNotifier = taskNotifier;
        this.assignmentStrategy = assignmentStrategy;
    }


    @Transactional
    public Project createProject(String name, String description, java.math.BigDecimal deposit, List<Long> departmentIds, User admin) {
        Project project = Project.builder()
                .name(name)
                .description(description)
                .depositAmount(deposit)
                .admin(admin)
                .status(Project.ProjectStatus.INITIATED)
                .build();
                
        Project savedProject = projectRepository.save(project);
        
        // Initialize the multi-step pipeline based on custom sequence
        initializeProjectPipeline(savedProject, departmentIds);
        
        return savedProject;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    private void initializeProjectPipeline(Project project, List<Long> departmentIds) {
        if (departmentIds == null || departmentIds.isEmpty()) {
            throw new RuntimeException("Workflow sequence cannot be empty");
        }

        for (int i = 0; i < departmentIds.size(); i++) {
            final int step = i + 1;
            Long deptId = departmentIds.get(i);
            Department dept = departmentRepository.findById(deptId)
                    .orElseThrow(() -> new RuntimeException("Department not found with ID: " + deptId));
            
            Task task = Task.builder()
                    .project(project)
                    .department(dept)
                    .stepOrder(step)
                    .status(step == 1 ? Task.TaskStatus.UNLOCKED : Task.TaskStatus.PENDING)
                    .build();
            
            // Strategy Pattern: Apply task assignment dynamically if unlocked
            if (task.getStatus() == Task.TaskStatus.UNLOCKED) {
                assignmentStrategy.assignTask(task);
            }
            
            taskRepository.save(task);
        }
    }

    @Transactional
    public void updateTaskStatus(UUID taskId, Task.TaskStatus newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(newStatus);
        Task updatedTask = taskRepository.save(task);

        // Observer Pattern: Notify subscribers (WebSocket layer)
        taskNotifier.onTaskUpdated(updatedTask);

        // Sequential Workflow logic: If task is APPROVED, unlock the next task
        if (newStatus == Task.TaskStatus.APPROVED) {
            unlockNextTask(task.getProject().getId(), task.getStepOrder());
        }
    }

    private void unlockNextTask(UUID projectId, int currentStepOrder) {
        List<Task> projectTasks = taskRepository.findByProjectIdOrderByStepOrderAsc(projectId);
        
        projectTasks.stream()
                .filter(t -> t.getStepOrder() == currentStepOrder + 1)
                .findFirst()
                .ifPresent(nextTask -> {
                    nextTask.setStatus(Task.TaskStatus.UNLOCKED);
                    Task unlockedTask = taskRepository.save(nextTask);
                    
                    // Strategy Pattern: Dynamic Assignment logic when unlocked
                    assignmentStrategy.assignTask(unlockedTask);

                    // Observer Pattern: Notify subscibers
                    taskNotifier.onTaskUpdated(unlockedTask);
                    
                    // Update project status to IN_PROGRESS if first task was approved
                    Project project = nextTask.getProject();
                    if (project.getStatus() == Project.ProjectStatus.INITIATED) {
                        project.setStatus(Project.ProjectStatus.IN_PROGRESS);
                        projectRepository.save(project);
                    }
                });

        // If no next task exists, the project is COMPLETED
        boolean anyPending = projectTasks.stream()
                .anyMatch(t -> t.getStatus() != Task.TaskStatus.APPROVED);
        
        if (!anyPending) {
            Project project = projectRepository.findById(projectId).orElseThrow();
            project.setStatus(Project.ProjectStatus.COMPLETED);
            projectRepository.save(project);
        }
    }


}

