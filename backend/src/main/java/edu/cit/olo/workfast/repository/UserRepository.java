package edu.cit.olo.workfast.repository;

import edu.cit.olo.workfast.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for User entity.
 * JpaRepository provides standard methods like save(), findById(), and delete().
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // You can add custom query methods here later, for example:
    // Optional<User> findByEmail(String email);
}