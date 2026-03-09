package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.security.JwtUtil;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // Hardcoded credentials (Phase 2'de User Rolleri ile DB'ye geçilecek)
    private String adminUser = "admin";
    private String adminPass = "admin123";

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        // First try DB
        return userRepository.findByUsernameAndActiveTrue(request.getUsername())
                .filter(user -> user.getPassword().equals(request.getPassword()) && user.getRole() == User.Role.ADMIN)
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getUsername(), "ADMIN");
                    return ResponseEntity.ok(new AuthResponse(token, "Login successful"));
                })
                .orElseGet(() -> {
                    // Fallback to hardcoded for initial setup if no DB admin exists yet
                    if (adminUser.equals(request.getUsername()) && adminPass.equals(request.getPassword())) {
                        String token = jwtUtil.generateToken(request.getUsername(), "ADMIN");
                        return ResponseEntity.ok(new AuthResponse(token, "Login successful"));
                    }
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new AuthResponse(null, "Invalid username or password"));
                });
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody Map<String, String> body) {
        String currentPass = body.get("currentPassword");
        String newPass = body.get("newPassword");

        if (newPass == null || newPass.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Yeni şifre en az 6 karakter olmalıdır"));
        }

        // Try to update in DB first (for users logged in via DB)
        Optional<User> adminOpt = userRepository.findByUsernameAndActiveTrue("admin");
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            if (!admin.getPassword().equals(currentPass)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Mevcut şifre hatalı"));
            }
            if (admin.getPassword().equals(newPass)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Yeni şifre eski şifre ile aynı olamaz"));
            }
            admin.setPassword(newPass);
            userRepository.save(admin);
            return ResponseEntity.ok(Map.of("message", "Şifre başarıyla güncellendi (DB)"));
        }

        // Fallback to hardcoded
        if (!adminPass.equals(currentPass)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Mevcut şifre hatalı"));
        }
        if (adminPass.equals(newPass)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Yeni şifre eski şifre ile aynı olamaz"));
        }
        adminPass = newPass;
        return ResponseEntity.ok(Map.of("message", "Şifre başarıyla güncellendi (Geçici)"));
    }
}
