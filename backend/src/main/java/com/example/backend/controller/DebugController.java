package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/db")
    public ResponseEntity<?> testDb() {
        try (Connection conn = dataSource.getConnection()) {
            boolean valid = conn.isValid(5);
            String metadata = conn.getMetaData().getDatabaseProductName() + " "
                    + conn.getMetaData().getDatabaseProductVersion();
            System.out.println("✅ Debug: Database connection is VALID. Server: " + metadata);
            return ResponseEntity.ok(Map.of(
                    "status", "UP",
                    "valid", valid,
                    "metadata", metadata));
        } catch (Exception e) {
            System.err.println("❌ Debug: Database connection FAILED: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "status", "DOWN",
                    "message", e.getMessage()));
        }
    }
}
