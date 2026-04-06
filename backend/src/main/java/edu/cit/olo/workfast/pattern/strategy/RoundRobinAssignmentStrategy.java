package edu.cit.olo.workfast.pattern.strategy;

import edu.cit.olo.workfast.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class RoundRobinAssignmentStrategy implements TaskAssignmentStrategy {
    @Override
    public void assignTask(Task task) {
        // Dummy logic to represent equal distribution
        System.out.println("Strategy executed: Assigned task " + task.getId() + " using Round Robin distribution.");
        // task.setAssignedUserId(...)
    }
}
