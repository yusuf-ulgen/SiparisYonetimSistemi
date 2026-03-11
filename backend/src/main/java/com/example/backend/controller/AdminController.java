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
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "Username and password required"));
        }
        System.out.println("🔐 Admin Login attempt for: " + request.getUsername());
        return userRepository.findByUsername(request.getUsername())
                .filter(user -> {
                    boolean active = Boolean.TRUE.equals(user.getActive());
                    boolean roleMatch = user.getRole() == User.Role.ADMIN;
                    boolean passMatch = passwordEncoder.matches(request.getPassword(), user.getPassword());
                    System.out.println(
                            "🔍 User found. Active: " + active + ", Role OK: " + roleMatch + ", Pass OK: " + passMatch);
                    return active && roleMatch && passMatch;
                })
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getUsername(), user.getRole().toString());
                    System.out.println("✅ Admin Login successful for: " + user.getUsername());
                    return ResponseEntity.ok(new AuthResponse(token, "Login successful"));
                })
                .orElseGet(() -> {
                    System.out.println(
                            "❌ Admin Login failed: User not found, inactive, wrong role, or invalid credentials for "
                                    + request.getUsername());
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new AuthResponse(null, "Invalid username or password"));
                });
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody Map<String, String> body) {
        String currentPass = body.get("currentPassword");
        String newPass = body.get("newPassword");

        if (newPass == null || newPass.length() < 6) {
            System.out.println("❌ Admin password change failed: New password too short or null.");
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Yeni şifre en az 6 karakter olmalıdır"));
        }

        Optional<User> adminOpt = userRepository.findByUsernameAndActiveTrue("admin");
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            if (!passwordEncoder.matches(currentPass, admin.getPassword())) {
                System.out.println("❌ Admin password change failed: Current password mismatch.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Mevcut şifre hatalı"));
            }
            if (passwordEncoder.matches(newPass, admin.getPassword())) {
                System.out.println("❌ Admin password change failed: New password is same as old password.");
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Yeni şifre eski şifre ile aynı olamaz"));
            }
            admin.setPassword(passwordEncoder.encode(newPass));
            userRepository.save(admin);
            System.out.println("✅ Admin password successfully changed.");
            return ResponseEntity.ok(Map.of("message", "Şifre başarıyla güncellendi"));
        }

        System.out.println("❌ Admin password change failed: Admin user not found.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Admin kullanıcısı bulunamadı"));
    }
}
