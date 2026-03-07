package com.example.backend.controller;

import com.example.backend.model.RestaurantTable;
import com.example.backend.repository.RestaurantTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
public class RestaurantTableController {

    @Autowired
    private RestaurantTableRepository tableRepository;

    @GetMapping
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantTable> getTableById(@PathVariable @NonNull Long id) {
        return tableRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public RestaurantTable createTable(@RequestBody @NonNull RestaurantTable table) {
        if (table.getQrCodeUrl() == null || table.getQrCodeUrl().isEmpty()) {
            table.setQrCodeUrl("http://localhost:3003/menu?table=" + table.getTableNumber());
        }
        return tableRepository.save(table);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantTable> updateTable(@PathVariable @NonNull Long id,
            @RequestBody @NonNull RestaurantTable tableDetails) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        table.setTableNumber(tableDetails.getTableNumber());
        table.setQrCodeUrl("http://localhost:3003/menu?table=" + tableDetails.getTableNumber());

        RestaurantTable updatedTable = tableRepository.save(table);
        return ResponseEntity.ok(updatedTable);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable @NonNull Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));
        tableRepository.delete(table);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/generate-qr")
    public ResponseEntity<RestaurantTable> generateQr(@PathVariable Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        table.setQrCodeUrl("http://localhost:3000/menu?table=" + table.getTableNumber());
        RestaurantTable updatedTable = tableRepository.save(table);
        return ResponseEntity.ok(updatedTable);
    }
}
