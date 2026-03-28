package edu.cit.olo.workfast.service;

import edu.cit.olo.workfast.dto.RegistrationRequest;
import edu.cit.olo.workfast.entity.User;
import edu.cit.olo.workfast.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setUsername(request.getName()); // Set username from name
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(newUser);
    }
}