package edu.cit.olo.workfast.pattern.strategy;

import edu.cit.olo.workfast.entity.Task;

/**
 * Strategy Pattern Interface for delegating algorithms.
 * WorkFast Use Case: Determining how a new Task is assigned to a department's users.
 */
public interface TaskAssignmentStrategy {
    void assignTask(Task task);
}
