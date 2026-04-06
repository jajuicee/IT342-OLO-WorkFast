-- Initial Roles
INSERT INTO roles (name, description) VALUES ('ADMIN', 'Full system access, creates projects') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name, description) VALUES ('MANAGER', 'Departmental oversight, approves tasks') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name, description) VALUES ('WORKER', 'Standard user, executes tasks') ON CONFLICT (name) DO NOTHING;

-- Initial Departments
INSERT INTO departments (name, description) VALUES ('RESEARCH', 'Initial project research and scoping') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name, description) VALUES ('DESIGN', 'Architectural and UI/UX design') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name, description) VALUES ('DEVELOPMENT', 'Software engineering and coding') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name, description) VALUES ('QA', 'Quality assurance and testing') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name, description) VALUES ('DEPLOYMENT', 'Final production rollout') ON CONFLICT (name) DO NOTHING;

-- Initial Test User (test3@gmail.com / 12345678)
-- Costs: Roles and Departments must exist first.
-- id is generated automatically (UUID).
INSERT INTO users (name, email, password_hash, role_id, department_id) 
SELECT 'Test User', 'test3@gmail.com', '$2y$12$6qg2f6w6v6z6.789012345uxyzuvyzuvyzuvyzuvyzuvyzuvyz', 
       (SELECT id FROM roles WHERE name = 'ADMIN'), 
       (SELECT id FROM departments WHERE name = 'RESEARCH')
ON CONFLICT (email) DO NOTHING;

