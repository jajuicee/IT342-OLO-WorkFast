package edu.cit.olo.workfast.pattern.facade;

import edu.cit.olo.workfast.entity.Project;
import edu.cit.olo.workfast.entity.User;
import edu.cit.olo.workfast.pattern.singleton.SupabaseConnectionManager;
import edu.cit.olo.workfast.service.ProjectService;
import org.springframework.stereotype.Component;

/**
 * Facade Pattern Implementation.
 * Provides a simplified interface to the complex subsystem of Project Management, Database initialization, and Task initialization.
 */
@Component
public class ProjectFacade {

    private final ProjectService projectService;
    private final SupabaseConnectionManager dbManager;

    public ProjectFacade(ProjectService projectService) {
        this.projectService = projectService;
        this.dbManager = SupabaseConnectionManager.getInstance();
    }

    /**
     * Facade method to handle complex project initialization logic behind a simple interface.
     */
    public Project initiateNewProject(Project project, User admin) {
        System.out.println("Facade: Orchestrating complex project initialization...");
        
        // 1. Singleton usage
        dbManager.logConnection();
        
        // 2. Subsystem call: Create Project and default pipeline
        Project createdProject = projectService.createProject(project, admin);
        
        // 3. (Mock) Initial file configuration / workspace logic
        System.out.println("Facade: Initializing virtual workspace repository...");
        
        return createdProject;
    }
}
