package edu.cit.olo.workfast.shared;

import edu.cit.olo.workfast.shared.pattern.singleton.SupabaseConnectionManager;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Design Pattern Unit Tests")
class DesignPatternTests {

    @Test
    @DisplayName("TC-PAT-001: Singleton returns same instance")
    void singleton_ReturnsSameInstance() {
        SupabaseConnectionManager a = SupabaseConnectionManager.getInstance();
        SupabaseConnectionManager b = SupabaseConnectionManager.getInstance();
        assertSame(a, b, "Singleton must return the same instance");
    }

    @Test
    @DisplayName("TC-PAT-002: Singleton has connection string")
    void singleton_HasConnectionString() {
        SupabaseConnectionManager mgr = SupabaseConnectionManager.getInstance();
        assertNotNull(mgr.getConnectionString());
        assertTrue(mgr.getConnectionString().contains("postgresql"));
    }

    @Test
    @DisplayName("TC-PAT-003: TaskFactory creates BUG task")
    void taskFactory_CreatesBugTask() {
        Object task = edu.cit.olo.workfast.task.TaskFactory.createTask("BUG", "Fix it", "Desc");
        assertNotNull(task);
    }

    @Test
    @DisplayName("TC-PAT-004: TaskFactory creates FEATURE task")
    void taskFactory_CreatesFeatureTask() {
        Object task = edu.cit.olo.workfast.task.TaskFactory.createTask("FEATURE", "Add it", "Desc");
        assertNotNull(task);
    }

    @Test
    @DisplayName("TC-PAT-005: TaskFactory rejects unknown type")
    void taskFactory_RejectsUnknownType() {
        assertThrows(IllegalArgumentException.class,
                () -> edu.cit.olo.workfast.task.TaskFactory.createTask("UNKNOWN", "X", "Y"));
    }
}
