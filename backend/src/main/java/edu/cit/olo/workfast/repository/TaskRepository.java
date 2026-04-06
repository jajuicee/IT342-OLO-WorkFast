package edu.cit.olo.workfast.repository;

import edu.cit.olo.workfast.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByProjectIdOrderByStepOrderAsc(UUID projectId);
    List<Task> findByDepartmentIdAndStatus(Long departmentId, Task.TaskStatus status);
}
