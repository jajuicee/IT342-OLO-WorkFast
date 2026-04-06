package edu.cit.olo.workfast.pattern.observer;

import edu.cit.olo.workfast.entity.Task;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

/**
 * Observer Implementation: Notifies clients via WebSocket when a task updates.
 */
@Component
public class WebSocketTaskNotifier implements TaskObserver {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketTaskNotifier(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void onTaskUpdated(Task task) {
        System.out.println("Observer notified: Broadcasting task update for " + task.getId());
        String destination = "/topic/tasks";
        messagingTemplate.convertAndSend(destination, task);
    }
}
