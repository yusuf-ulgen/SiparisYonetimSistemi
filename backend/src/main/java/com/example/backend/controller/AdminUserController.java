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
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;

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

        User staff = new User();
        staff.setUsername(username);
        staff.setPassword(password);
        staff.setRole(User.Role.STAFF);
        staff.setActive(true);

        return ResponseEntity.ok(userRepository.save(staff));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateStaff(@PathVariable @NonNull Long id) {
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
