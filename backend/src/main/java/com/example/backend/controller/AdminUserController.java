package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getStaffUsers() {
        return userRepository.findByRoleAndActiveTrue(User.Role.STAFF);
    }

    @PostMapping
    public ResponseEntity<?> createStaff(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || username.isBlank() || password == null || password.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username and password of at least 6 characters required"));
        }
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "This username is already in use"));
        }

        User staff = new User();
        staff.setUsername(username);
        staff.setPassword(passwordEncoder.encode(password));
        staff.setRole(User.Role.STAFF);
        staff.setActive(true);

        return ResponseEntity.ok(userRepository.save(staff));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateStaff(@PathVariable @NonNull Long id) {
        return userRepository.findById(id).map(user -> {
            if (user.getRole() == User.Role.ADMIN) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Admin account cannot be deleted"));
            }
            user.setActive(false);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Account deactivated"));
        }).orElse(ResponseEntity.notFound().build());
    }
}