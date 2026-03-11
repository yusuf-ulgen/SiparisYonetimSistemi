package com.example.backend.controller;

import com.example.backend.model.SiteSettings;
import com.example.backend.repository.SiteSettingsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SiteSettingsController {

    private final SiteSettingsRepository siteSettingsRepository;

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
                SiteSettings newSetting = new SiteSettings();
                newSetting.setSettingKey(entry.getKey());
                newSetting.setSettingValue(entry.getValue());
                newSetting.setDescription("Created: " + entry.getKey());
                siteSettingsRepository.save(newSetting);
            }
        }

        return ResponseEntity.ok(Map.of("message", "Settings updated successfully."));
    }
}