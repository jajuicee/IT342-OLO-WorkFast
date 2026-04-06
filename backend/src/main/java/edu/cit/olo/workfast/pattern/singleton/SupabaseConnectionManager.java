package edu.cit.olo.workfast.pattern.singleton;

/**
 * Singleton Pattern: Ensures that a class has only one instance while providing a global access point to this instance.
 * WorkFast Use Case: Managing the Database Configuration for the Supabase connection pool.
 */
public class SupabaseConnectionManager {

    // Volatile keyword ensures visibility of changes to variables across threads
    private static volatile SupabaseConnectionManager instance;
    private String connectionString;

    // Private constructor prevents instantiation from other classes
    private SupabaseConnectionManager() {
        // Initialize connection config
        this.connectionString = "jdbc:postgresql://supabase.com:5432/workfast_db";
        System.out.println("Global Supabase Connection Pool Initialized.");
    }

    /**
     * Double-checked locking to ensure thread safety without unneeded synchronization overhead.
     */
    public static SupabaseConnectionManager getInstance() {
        if (instance == null) {
            synchronized (SupabaseConnectionManager.class) {
                if (instance == null) {
                    instance = new SupabaseConnectionManager();
                }
            }
        }
        return instance;
    }

    public String getConnectionString() {
        return connectionString;
    }

    public void logConnection() {
        System.out.println("Executing query on: " + connectionString);
    }
}
