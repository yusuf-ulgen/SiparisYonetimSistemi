package com.example.backend.controller;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

/**
 * Handles login for BOTH Admin and Staff roles.
 * POST /api/auth/login → { username, password } → returns JWT with role claim
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
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
        return userRepository.findByUsername(request.getUsername())
                .filter(user -> Boolean.TRUE.equals(user.getActive())
                        && passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
                    return ResponseEntity.ok(new AuthResponse(token, "Login successful"));
                })
                .orElse(ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse(null, "Invalid username or password")));
    }
}
