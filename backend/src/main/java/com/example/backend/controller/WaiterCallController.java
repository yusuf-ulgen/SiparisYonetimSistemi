package com.example.backend.controller;

import com.example.backend.model.WaiterCall;
import com.example.backend.repository.WaiterCallRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/waiter-calls")
@CrossOrigin(origins = "*")
public class WaiterCallController {

    @Autowired
    private WaiterCallRepository waiterCallRepository;

    // Müşteri garson çağırır
    @PostMapping
    public ResponseEntity<WaiterCall> createCall(@RequestBody Map<String, String> body) {
        String tableNumber = body.getOrDefault("tableNumber", "Bilinmiyor");
        WaiterCall call = new WaiterCall();
        call.setTableNumber(tableNumber);
        call.setDismissed(false);
        return ResponseEntity.ok(waiterCallRepository.save(call));
    }

    // Staff paneli aktif çağrıları çeker
    @GetMapping("/active")
    public List<WaiterCall> getActiveCalls() {
        return waiterCallRepository.findByDismissedFalseOrderByCreatedAtDesc();
    }

    // Staff çağrıyı kapatır
    @PutMapping("/{id}/dismiss")
    public ResponseEntity<WaiterCall> dismissCall(@PathVariable Long id) {
        return waiterCallRepository.findById(id).map(call -> {
            call.setDismissed(true);
            return ResponseEntity.ok(waiterCallRepository.save(call));
        }).orElse(ResponseEntity.notFound().build());
    }
}
