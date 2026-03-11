package com.example.backend.controller;

import com.example.backend.model.RestaurantTable;
import com.example.backend.repository.RestaurantTableRepository;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class RestaurantTableController {

    private final RestaurantTableRepository tableRepository;

    @GetMapping
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    @SuppressWarnings("null")
    @GetMapping("/{id}")
    public ResponseEntity<RestaurantTable> getTableById(@PathVariable Long id) {
        return tableRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public RestaurantTable createTable(@RequestBody RestaurantTable table) {
        if (table.getQrCodeUrl() == null || table.getQrCodeUrl().isEmpty()) {
            table.setQrCodeUrl("http://localhost:3000/menu?table=" + table.getTableNumber());
        }
        return tableRepository.save(table);
    }

    @SuppressWarnings("null")
    @PutMapping("/{id}")
    public ResponseEntity<RestaurantTable> updateTable(@PathVariable Long id,
            @RequestBody RestaurantTable tableDetails) {
        return tableRepository.findById(id).map((RestaurantTable table) -> {
            table.setTableNumber(tableDetails.getTableNumber());
            table.setQrCodeUrl("http://localhost:3000/menu?table=" + tableDetails.getTableNumber());
            table.setOccupied(tableDetails.isOccupied());
            return ResponseEntity.ok(tableRepository.save(table));
        }).orElseThrow(() -> new RuntimeException("Table not found"));
    }

    @SuppressWarnings("null")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        return tableRepository.findById(id).map((RestaurantTable table) -> {
            tableRepository.delete(table);
            return ResponseEntity.ok().<Void>build();
        }).orElseThrow(() -> new RuntimeException("Table not found"));
    }

    @SuppressWarnings("null")
    @PostMapping("/{id}/generate-qr")
    public ResponseEntity<RestaurantTable> generateQr(@PathVariable Long id) {
        return tableRepository.findById(id).map((RestaurantTable table) -> {
            table.setQrCodeUrl("http://localhost:3000/menu?table=" + table.getTableNumber());
            return ResponseEntity.ok(tableRepository.save(table));
        }).orElseThrow(() -> new RuntimeException("Table not found"));
    }
}