package com.example.backend.controller;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private JwtUtil jwtUtil;

    // Hardcoded credentials (Phase 2'de User Rolleri ile DB'ye geçilecek)
    private String adminUser = "admin";
    private String adminPass = "admin123";

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        if (adminUser.equals(request.getUsername()) && adminPass.equals(request.getPassword())) {
            String token = jwtUtil.generateToken(request.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, "Login successful"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, "Invalid username or password"));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody Map<String, String> body) {
        String currentPass = body.get("currentPassword");
        String newPass = body.get("newPassword");

        if (!adminPass.equals(currentPass)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Mevcut şifre hatalı"));
        }
        if (newPass == null || newPass.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Yeni şifre en az 6 karakter olmalıdır"));
        }
        adminPass = newPass;
        return ResponseEntity.ok(Map.of("message", "Şifre başarıyla güncellendi"));
    }
}
