package edu.cit.olo.workfast.task.observer;

import edu.cit.olo.workfast.task.entity.Task;

/**
 * Observer Pattern Interface
 */
public interface TaskObserver {
    void onTaskUpdated(Task task);
}
