package edu.cit.olo.workfast.controller;

import edu.cit.olo.workfast.dto.AuthResponse;
import edu.cit.olo.workfast.dto.LoginRequest;
import edu.cit.olo.workfast.dto.RegisterRequest;
import edu.cit.olo.workfast.entity.User;
import edu.cit.olo.workfast.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // Check if user already exists (using email as username)
        if (userRepository.findByUsername(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse("User already exists", false, null));
        }

        // Create new user (Mapping Email to Username as per DB schema)
        User user = new User();
        user.setUsername(request.getEmail()); 
        user.setPassword(request.getPassword());
        
        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse("Registration successful", true, savedUser.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // In a real app, use BCryptPasswordEncoder. Here we use plain text matching for simplicity based on the current setup.
            if (user.getPassword().equals(request.getPassword())) {
                return ResponseEntity.ok(new AuthResponse("Login successful", true, user.getId()));
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse("Invalid credentials", false, null));
    }
}
