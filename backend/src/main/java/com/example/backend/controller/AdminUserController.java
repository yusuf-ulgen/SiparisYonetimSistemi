package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin-only endpoints for managing staff accounts.
 * GET /api/admin/users → list all staff accounts
 * POST /api/admin/users → create new staff account
 * DELETE /api/admin/users/{id} → deactivate staff account
 */
@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

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
                    .body(Map.of("message", "Kullanıcı adı ve en az 6 karakterli şifre gerekli"));
        }
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Bu kullanıcı adı zaten kullanılıyor"));
        }

        User staff = User.builder()
                .username(username)
                .password(password)
                .role(User.Role.STAFF)
                .active(true)
                .build();

        return ResponseEntity.ok(userRepository.save(staff));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateStaff(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            if (user.getRole() == User.Role.ADMIN) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Admin hesabı silinemez"));
            }
            user.setActive(false);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Hesap deaktif edildi"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
