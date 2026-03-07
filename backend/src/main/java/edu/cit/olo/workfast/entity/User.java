package edu.cit.olo.workfast.entity;

import jakarta.persistence.*;
import lombok.Data; // If you are using Lombok

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    // Add other fields relevant to WorkFast here
}