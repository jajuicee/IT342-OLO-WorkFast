package edu.cit.olo.workfast.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JsonIgnore
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    @JsonIgnore
    private Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User assignedUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @Column(name = "step_order", nullable = false)
    private int stepOrder;

    // Transient JSON-only fields for the frontend
    @Transient
    @JsonProperty("projectId")
    public String getProjectIdString() {
        return project != null ? project.getId().toString() : null;
    }

    @Transient
    @JsonProperty("departmentId")
    public Long getDepartmentIdValue() {
        return department != null ? department.getId() : null;
    }

    @Transient
    @JsonProperty("departmentName")
    public String getDepartmentNameValue() {
        return department != null ? department.getName() : null;
    }

    public enum TaskStatus {
        PENDING, UNLOCKED, IN_PROGRESS, SUBMITTED, APPROVED, REJECTED
    }
}
