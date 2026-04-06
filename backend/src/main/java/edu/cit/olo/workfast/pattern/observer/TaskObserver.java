package edu.cit.olo.workfast.pattern.observer;

import edu.cit.olo.workfast.entity.Task;

/**
 * Observer Pattern Interface
 */
public interface TaskObserver {
    void onTaskUpdated(Task task);
}
