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
        return userRepository.findByUsername(request.getUsername())
                .filter(user -> user.isActive() &&
                        user.getRole() == User.Role.ADMIN &&
                        passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getUsername(), "ADMIN");
                    return ResponseEntity.ok(new AuthResponse(token, "Login successful"));
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse(null, "Invalid username or password")));
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody Map<String, String> body) {
        String currentPass = body.get("currentPassword");
        String newPass = body.get("newPassword");

        if (newPass == null || newPass.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Yeni şifre en az 6 karakter olmalıdır"));
        }

        Optional<User> adminOpt = userRepository.findByUsernameAndActiveTrue("admin");
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            if (!passwordEncoder.matches(currentPass, admin.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Mevcut şifre hatalı"));
            }
            if (passwordEncoder.matches(newPass, admin.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Yeni şifre eski şifre ile aynı olamaz"));
            }
            admin.setPassword(passwordEncoder.encode(newPass));
            userRepository.save(admin);
            return ResponseEntity.ok(Map.of("message", "Şifre başarıyla güncellendi"));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Admin kullanıcısı bulunamadı"));
    }
}
