package com.example.backend.controller;

import com.example.backend.model.SiteSettings;
import com.example.backend.repository.SiteSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SiteSettingsController {

    @Autowired
    private SiteSettingsRepository siteSettingsRepository;

    // Public endpoint: Returns all settings as a key-value map for the frontend to
    // consume easily
    @GetMapping
    public ResponseEntity<Map<String, String>> getAllSettingsAsMap() {
        List<SiteSettings> settingsList = siteSettingsRepository.findAll();
        Map<String, String> settingsMap = new HashMap<>();

        for (SiteSettings setting : settingsList) {
            settingsMap.put(setting.getSettingKey(), setting.getSettingValue());
        }

        return ResponseEntity.ok(settingsMap);
    }

    // Admin endpoint: Update multiple settings at once
    @PutMapping
    public ResponseEntity<Map<String, String>> updateSettings(@RequestBody Map<String, String> updates) {
        for (Map.Entry<String, String> entry : updates.entrySet()) {
            Optional<SiteSettings> existingOpt = siteSettingsRepository.findBySettingKey(entry.getKey());

            if (existingOpt.isPresent()) {
                SiteSettings existing = existingOpt.get();
                existing.setSettingValue(entry.getValue());
                siteSettingsRepository.save(existing);
            } else {
                SiteSettings newSetting = SiteSettings.builder()
                        .settingKey(entry.getKey())
                        .settingValue(entry.getValue())
                        .description("Oluşturuldu: " + entry.getKey())
                        .build();
                siteSettingsRepository.save(newSetting);
            }
        }

        return ResponseEntity.ok(Map.of("message", "Ayarlar başarıyla güncellendi."));
    }
}
