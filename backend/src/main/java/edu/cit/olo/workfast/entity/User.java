package edu.cit.olo.workfast.entity;

import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name = "users")
@Data // This handles getters/setters if you have the Lombok extension
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String role; // e.g., "USER" or "ADMIN"
}