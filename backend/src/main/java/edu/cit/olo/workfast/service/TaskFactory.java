package edu.cit.olo.workfast.service;

import java.util.Date;

/**
 * Interface representing a Task in the WorkFast system.
 */
interface Task {
    String getTitle();
    String getDescription();
    String getType();
    void execute();
}

/**
 * Concrete implementation for a Bug Task.
 */
class BugTask implements Task {
    private String title;
    private String description;

    public BugTask(String title, String description) {
        this.title = title;
        this.description = description;
    }

    @Override
    public String getTitle() { return title; }

    @Override
    public String getDescription() { return description; }

    @Override
    public String getType() { return "BUG"; }

    @Override
    public void execute() {
        System.out.println("Fixing bug: " + title);
    }
}

/**
 * Concrete implementation for a Feature Task.
 */
class FeatureTask implements Task {
    private String title;
    private String description;

    public FeatureTask(String title, String description) {
        this.title = title;
        this.description = description;
    }

    @Override
    public String getTitle() { return title; }

    @Override
    public String getDescription() { return description; }

    @Override
    public String getType() { return "FEATURE"; }

    @Override
    public void execute() {
        System.out.println("Implementing feature: " + title);
    }
}

/**
 * Factory Pattern Implementation for Task Management.
 */
public class TaskFactory {
    
    /**
     * Factory method to create tasks based on type.
     * 
     * @param type The type of task (BUG, FEATURE)
     * @param title The title of the task
     * @param description The description of the task
     * @return A concrete Task object
     */
    public static Task createTask(String type, String title, String description) {
        if (type == null) {
            return null;
        }
        
        if (type.equalsIgnoreCase("BUG")) {
            return new BugTask(title, description);
        } else if (type.equalsIgnoreCase("FEATURE")) {
            return new FeatureTask(title, description);
        }
        
        throw new IllegalArgumentException("Unknown task type: " + type);
    }

    // Example Usage
    public static void main(String[] args) {
        Task bug = TaskFactory.createTask("BUG", "Fix Login Error", "Users are unable to log in on Safari.");
        Task feature = TaskFactory.createTask("FEATURE", "Add Dark Mode", "Implement dark mode for the dashboard.");
        
        bug.execute();
        feature.execute();
    }
}
