package com.example.backend.controller;

import com.example.backend.model.WaiterCall;
import com.example.backend.repository.WaiterCallRepository;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/waiter-calls")
@RequiredArgsConstructor
public class WaiterCallController {

    private final WaiterCallRepository waiterCallRepository;

    // Customer calls a waiter
    @PostMapping
    public ResponseEntity<WaiterCall> createCall(@RequestBody Map<String, String> body) {
        String tableNumber = body.getOrDefault("tableNumber", "Unknown");
        WaiterCall call = new WaiterCall();
        call.setTableNumber(tableNumber);
        call.setDismissed(false);
        return ResponseEntity.ok(waiterCallRepository.save(call));
    }

    // Staff panel fetches active calls
    @GetMapping("/active")
    public List<WaiterCall> getActiveCalls() {
        return waiterCallRepository.findByDismissedFalseOrderByCreatedAtDesc();
    }

    // Staff dismisses a call
    @PutMapping("/{id}/dismiss")
    public ResponseEntity<WaiterCall> dismissCall(@PathVariable @NonNull Long id) {
        return waiterCallRepository.findById(id).map(call -> {
            call.setDismissed(true);
            return ResponseEntity.ok(waiterCallRepository.save(call));
        }).orElse(ResponseEntity.notFound().build());
    }
}