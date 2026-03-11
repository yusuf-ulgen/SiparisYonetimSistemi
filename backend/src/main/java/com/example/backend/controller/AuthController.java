package com.example.backend.controller;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Username and password required"));
        }
        System.out.println("🔐 Auth Login attempt for: " + request.getUsername());
        return userRepository.findByUsername(request.getUsername())
                .filter(user -> {
                    boolean active = Boolean.TRUE.equals(user.getActive());
                    boolean passMatch = passwordEncoder.matches(request.getPassword(), user.getPassword());
                    System.out.println("🔍 User found. Active: " + active + ", Pass OK: " + passMatch);
                    return active && passMatch;
                })
                .map(user -> {
                    String roleStr = user.getRole() != null ? user.getRole().toString() : "STAFF";
                    String token = jwtUtil.generateToken(user.getUsername(), roleStr);
                    System.out.println("✅ Auth Login successful for: " + user.getUsername());
                    return ResponseEntity.ok(new AuthResponse(token, "Login successful"));
                })
                .orElseGet(() -> {
                    System.out.println("❌ Auth Login failed: User not found or mismatch for " + request.getUsername());
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new AuthResponse(null, "Invalid username or password"));
                });
    }
}